import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../lib/api";

// Applies the text and image edits made in the admin's visual editor. Each edit says "on this page (or on
// every page), show X instead of Y"; matching text nodes and <img> sources are swapped after React renders,
// and again whenever the page changes. An admin who started editing from the dashboard also gets the editor.

const EditLayer = lazy(() => import("../admin/EditLayer"));
export const EDIT_FLAG = "cube_edit";

const norm = (s) => s.replace(/\s+/g, " ").trim();
// What a node showed before we changed it, so the editor can always find the original text or image.
export const originals = new WeakMap();

const skip = (el) => !el || el.closest("[data-cube-ui], script, style, textarea, input, select, [contenteditable]");

function apply(overrides, path) {
  const texts = new Map();
  const images = new Map();
  // Site-wide edits first, so an edit for this page wins.
  for (const o of [...overrides.filter((o) => o.scope === "*"), ...overrides.filter((o) => o.scope === path)]) {
    if (o.kind === "text") texts.set(o.original, o.replacement);
    else if (o.replacement) images.set(o.original, o);
  }
  if (texts.size) {
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const shown = norm(n.nodeValue);
      if (!shown) continue;
      const prev = originals.get(n);
      const original = prev && prev.shown === shown ? prev.original : shown;
      const next = texts.get(original);
      if (next === undefined || next === shown || skip(n.parentElement)) continue;
      const [, lead, , trail] = n.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
      n.nodeValue = `${lead}${next}${trail}`;
      originals.set(n, { original, shown: norm(next) });
    }
  }
  if (images.size) {
    for (const img of document.body.querySelectorAll("img")) {
      if (skip(img)) continue;
      const src = img.getAttribute("src");
      const prev = originals.get(img);
      const original = prev && prev.shown === src ? prev.original : src;
      const edit = images.get(original);
      const next = edit?.replacement;
      if (!next || next === src) continue;
      img.setAttribute("src", next);
      img.removeAttribute("srcset");
      // Keep the shape of the spot the original filled, whatever the new file's size: a big or differently
      // shaped image is scaled and cropped to fit instead of stretching the layout. Images meant to show whole
      // (object-fit: contain, e.g. logos) are scaled to fit without cropping.
      if (edit.width && edit.height) {
        img.style.aspectRatio = `${edit.width} / ${edit.height}`;
        img.style.maxWidth = "100%";
        if (getComputedStyle(img).objectFit === "fill") img.style.objectFit = "cover";
      }
      originals.set(img, { original, shown: next });
    }
  }
}

export default function SiteContent() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";
  const [overrides, setOverrides] = useState([]);
  const [editing] = useState(() => {
    try {
      return sessionStorage.getItem(EDIT_FLAG) === "1";
    } catch {
      return false;
    }
  });
  const frame = useRef(0);

  useEffect(() => {
    api("/content")
      .then((d) => setOverrides(d.overrides))
      .catch(() => {});
  }, []);

  const run = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => apply(overrides, path));
  }, [overrides, path]);

  useEffect(() => {
    if (!overrides.length) return undefined;
    run();
    const watch = new MutationObserver(run);
    watch.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["src"] });
    return () => {
      watch.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [overrides, run]);

  return editing ? (
    <Suspense fallback={null}>
      <EditLayer path={path} overrides={overrides} setOverrides={setOverrides} />
    </Suspense>
  ) : null;
}
