import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { isVideo, pagePath, refreshContent, setContent, useContent } from "../lib/content";
import { EDIT_FLAG, editing as editMode } from "../lib/editable";
import { refreshSiteData, useSiteData } from "../lib/site";

// Applies the text, image and video edits made in the admin's visual editor. Each edit says "on this page
// (or on every page), show X instead of Y"; matching text nodes, <img> sources and <video> sources are
// swapped after React renders, and again whenever the page changes. (Card lists and animation spots apply
// themselves: see lib/editable.js and MediaSlot.) An admin who started editing also gets the editor.

const EditLayer = lazy(() => import("../admin/EditLayer"));
export { EDIT_FLAG };

const norm = (s) => s.replace(/\s+/g, " ").trim();
// What a node showed before we changed it, so the editor can always find the original text or image.
export const originals = new WeakMap();

const skip = (el) => !el || el.closest("[data-cube-ui], [data-cube-counting], script, style, textarea, input, [contenteditable]");

// --- Removing things from the site ------------------------------------------------------------------------
// A removal is saved as an edit whose "original" says what was clicked and how much goes with it:
// hide:<self|block|card|section>:<t text | m picture or video | s animation spot>:<surrounding text>\n<which>.
// The surrounding text tells apart the same words used elsewhere on a page (a card and a menu link, say).
// Whatever is removed is taken out of the layout (display: none), so grids and rows close up by themselves.
// shortcut: rewriting other text in that surrounding brings the removed item back, undo and redo it if so.
const cardOf = (el) => {
  const item = el.closest("li, article");
  if (item) return item;
  let best = null;
  for (let p = el.parentElement; p && p.tagName !== "SECTION" && p.tagName !== "MAIN"; p = p.parentElement) if (/\brounded-/.test(p.className) && /\b(border|ring-1)\b/.test(p.className)) best = p;
  return best;
};
// The smallest thing around el that holds more than el does (a number together with its label, say).
const blockOf = (el) => {
  const own = (el.textContent || "").trim();
  let p = el.parentElement;
  while (p && (p.textContent || "").trim() === own && !p.querySelector("img, video")) p = p.parentElement;
  return p && !p.matches("section, main, body, #root, .App") ? p : null;
};
const removalTarget = (el, level) => (level === "section" ? el.closest("section") : level === "card" ? cardOf(el) : level === "block" ? blockOf(el) : el);
export const removalContext = (el, level) => norm((level === "self" ? blockOf(el) || el : removalTarget(el, level))?.textContent || "").slice(0, 200);

// What can be removed around a clicked element, smallest first, without repeats.
export function removalOptions(el, selfLabel) {
  const seen = new Set();
  return [
    ["self", selfLabel],
    ["block", "this whole block"],
    ["card", "this whole card"],
    ["section", "this whole section"],
  ]
    .map(([level, label]) => ({ level, label, target: removalTarget(el, level) }))
    .filter((o) => o.target && !seen.has(o.target) && seen.add(o.target))
    .map(({ level, label, target }) => ({ level, label, preview: norm(target.textContent || "").slice(0, 90) }))
    .filter((o, i, all) => !o.preview || !all.slice(i + 1).some((x) => x.preview === o.preview)); // same content: offer only the larger one
}

function hide(el) {
  el.setAttribute("data-cube-hidden", "");
  // A wrapper left with nothing visible goes too, so its padding doesn't leave a gap.
  for (let p = el.parentElement; p && !p.matches("main, body, #root, .App"); p = p.parentElement) {
    const hasText = [...p.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && norm(n.nodeValue));
    const visible = [...p.children].some((c) => !c.hasAttribute("data-cube-hidden") && c.getAttribute("aria-hidden") !== "true");
    if (hasText || visible) break;
    p.setAttribute("data-cube-hidden", "");
  }
}

function applyRemovals(overrides, path) {
  // Rebuilt on every pass: the header and footer stay on screen between pages with different removals.
  for (const el of document.querySelectorAll("[data-cube-hidden]")) el.removeAttribute("data-cube-hidden");
  const rules = { t: new Map(), m: new Map(), s: new Map() };
  for (const o of overrides) {
    const m = (o.scope === "*" || o.scope === path) && /^hide:(\w+):([tms]):([^\n]*)\n([\s\S]*)$/.exec(o.original);
    if (m) rules[m[2]].set(m[4], [...(rules[m[2]].get(m[4]) || []), { level: m[1], context: m[3] }]);
  }
  const remove = (el, levels) => levels.forEach(({ level, context }) => {
    const target = removalTarget(el, level);
    if (target && removalContext(el, level) === context) hide(target);
  });
  if (rules.t.size) {
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const shown = norm(n.nodeValue);
      if (!shown || skip(n.parentElement)) continue;
      const prev = originals.get(n);
      const levels = rules.t.get(prev && prev.shown === shown ? prev.original : shown);
      if (levels) remove(n.parentElement, levels);
    }
  }
  if (rules.m.size) {
    for (const el of document.body.querySelectorAll("img, video")) {
      if (skip(el)) continue;
      const src = el.getAttribute("src") || el.querySelector?.("source")?.getAttribute("src");
      const prev = originals.get(el);
      const levels = rules.m.get(prev ? prev.original : src);
      if (levels) remove(el, levels);
    }
  }
  for (const [id, levels] of rules.s) {
    const el = document.querySelector(`[data-cube-slot="${CSS.escape(id)}"]`);
    if (el) remove(el, levels);
  }
}

// --- One piece of text sized on its own ------------------------------------------------------------------------------
// Saved as an edit "size:<original words>" with a percentage. It multiplies the element's --fs, so the text keeps its
// responsive sizes; text that only inherits its size from a parent is sized as a percentage of that instead.
export function sizeText(el, pct) {
  el.style.removeProperty("--fs");
  el.style.removeProperty("font-size");
  el.removeAttribute("data-cube-sized");
  if (pct === 100) return;
  const style = getComputedStyle(el);
  const before = parseFloat(style.fontSize);
  el.setAttribute("data-cube-sized", "");
  el.style.setProperty("--fs", `calc(${style.getPropertyValue("--fs") || 1} * ${pct / 100})`);
  if (Math.abs(parseFloat(getComputedStyle(el).fontSize) - before) < 0.1) el.style.fontSize = `${pct}%`;
}

function applySizes(overrides, path) {
  // Text being sized in the editor's box right now keeps its live preview.
  for (const el of document.querySelectorAll("[data-cube-sized]:not([data-cube-sizing])")) sizeText(el, 100);
  const sizes = new Map();
  for (const o of [...overrides.filter((x) => x.scope === "*"), ...overrides.filter((x) => x.scope === path)]) if (o.kind === "image" && o.original.startsWith("size:")) sizes.set(o.original.slice(5), Number(o.replacement));
  if (!sizes.size) return;
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const shown = norm(n.nodeValue);
    if (!shown || skip(n.parentElement) || n.parentElement.hasAttribute("data-cube-sizing")) continue;
    const prev = originals.get(n);
    const pct = sizes.get(prev && prev.shown === shown ? prev.original : shown);
    if (pct) sizeText(n.parentElement, pct);
  }
}

// --- Sections switched off in the dashboard (Pages) ------------------------------------------------------------------
// Each top-level section of a page is named by its heading's original words (so editing a heading keeps its switch),
// or by its place on the page when it has no heading. The name goes on the section for the dashboard to read.
function originalText(el) {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let out = "";
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const shown = norm(n.nodeValue);
    const prev = originals.get(n);
    out += ` ${prev && prev.shown === shown ? prev.original : shown}`;
  }
  return norm(out);
}
function applySections(off) {
  const seen = new Map();
  const sections = [...document.querySelectorAll("main section")].filter((s) => !s.parentElement.closest("main section"));
  sections.forEach((s, i) => {
    const head = s.querySelector("h1, h2, h3");
    let key = (head ? originalText(head) : "").slice(0, 120) || `Section ${i + 1}`;
    const n = (seen.get(key) || 0) + 1;
    seen.set(key, n);
    if (n > 1) key += ` #${n}`;
    if (s.getAttribute("data-cube-section") !== key) s.setAttribute("data-cube-section", key);
    if (off?.includes(key)) s.setAttribute("data-cube-hidden", "");
  });
}

// A phone number edited as text also changes its call links and any mention inside a longer sentence, in
// whichever format it's written there (+91 80 68 69 44 40, +91 806 869 4440, tel:+918068694440).
const PHONE = /^\+?[\d\s()-]{7,}$/;
const digitsOf = (s) => s.replace(/\D/g, "");

function applyPhones(texts) {
  const edits = [...texts].filter(([from, to]) => PHONE.test(from) && PHONE.test(to) && digitsOf(from) !== digitsOf(to));
  const byDigits = new Map(edits.map(([from, to]) => [digitsOf(from), to]));
  for (const a of document.querySelectorAll('a[href^="tel:"]')) {
    const href = a.getAttribute("href");
    const was = originals.get(a)?.original || href;
    const to = byDigits.get(digitsOf(was));
    const want = to ? `tel:${to.replace(/[^\d+]/g, "")}` : was;
    if (to) originals.set(a, { original: was });
    if (href !== want) a.setAttribute("href", want);
  }
  if (!edits.length) return;
  const mention = new RegExp(edits.map(([from]) => from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const value = n.nodeValue;
    if (!/\d/.test(value) || skip(n.parentElement)) continue;
    const next = value.replace(mention, (from) => texts.get(from));
    if (next === value) continue;
    const prev = originals.get(n);
    const shown = norm(value);
    originals.set(n, { original: prev && prev.shown === shown ? prev.original : shown, shown: norm(next), phone: true });
    n.nodeValue = next;
  }
}

function apply(overrides, path, sectionsOff) {
  const texts = new Map();
  const images = new Map();
  // Site-wide edits first, so an edit for this page wins.
  for (const o of [...overrides.filter((o) => o.scope === "*"), ...overrides.filter((o) => o.scope === path)]) {
    if (o.kind === "text") texts.set(o.original, o.replacement);
    else if (o.replacement) images.set(o.original, o);
  }
  {
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const shown = norm(n.nodeValue);
      if (!shown) continue;
      const prev = originals.get(n);
      const ours = prev && prev.shown === shown;
      const original = ours ? prev.original : shown;
      let next = texts.get(original);
      // Text the header or footer kept from the last page's edit (or an edit just deleted) goes back to its own words.
      if (next === undefined && ours && !prev.phone && original !== shown) next = original;
      if (next === undefined || next === shown || skip(n.parentElement)) continue;
      const [, lead, , trail] = n.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
      n.nodeValue = `${lead}${next}${trail}`;
      if (next === original) originals.delete(n);
      else originals.set(n, { original, shown: norm(next) });
    }
  }
  applyPhones(texts);
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
    // Background and hero videos. A video replaces the source; a picture or GIF is shown in the video's
    // place (same size and position) and the video is hidden.
    for (const v of document.body.querySelectorAll("video")) {
      if (skip(v)) continue;
      const source = v.querySelector("source");
      const prev = originals.get(v);
      const original = prev ? prev.original : v.getAttribute("src") || source?.getAttribute("src");
      const next = original && images.get(original)?.replacement;
      if (!next || prev?.shown === next) continue;
      originals.set(v, { original, shown: next });
      if (isVideo(next)) {
        (source || v).setAttribute("src", next);
        v.load();
        v.play?.()?.catch?.(() => {});
      } else {
        v.style.display = "none";
        const still = v.nextElementSibling?.hasAttribute("data-cube-swap") ? v.nextElementSibling : v.insertAdjacentElement("afterend", document.createElement("img"));
        Object.assign(still, { className: v.className, alt: "", src: next });
        still.setAttribute("data-cube-swap", "");
      }
    }
  }
  applyRemovals(overrides, path);
  applySizes(overrides, path);
  applySections(sectionsOff);
}

export default function SiteContent() {
  const { pathname } = useLocation();
  const path = pagePath(pathname);
  const { overrides } = useContent();
  const off = useSiteData().sectionsOff?.[path];
  const setOverrides = useCallback((next) => setContent({ overrides: next }), []);
  const [editing] = useState(editMode);
  const frame = useRef(0);

  const run = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => apply(overrides, path, off));
  }, [overrides, path, off]);

  useEffect(() => {
    run();
    // A number counting up changes every frame; reacting to it would hold back every other edit until it stops.
    const counting = (r) => (r.target.nodeType === Node.TEXT_NODE ? r.target.parentElement : r.target)?.closest?.("[data-cube-counting]");
    const watch = new MutationObserver((records) => records.some((r) => !counting(r)) && run());
    watch.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["src"] });
    return () => {
      watch.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [overrides, run]);

  // Edits saved in the dashboard while this tab sat open show up when the visitor comes back to it.
  useEffect(() => {
    if (editing) return undefined;
    const back = () => {
      if (document.visibilityState !== "visible") return;
      refreshContent();
      refreshSiteData();
    };
    document.addEventListener("visibilitychange", back);
    return () => document.removeEventListener("visibilitychange", back);
  }, [editing]);

  return editing ? (
    <Suspense fallback={null}>
      <EditLayer path={path} overrides={overrides} setOverrides={setOverrides} />
    </Suspense>
  ) : null;
}
