import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { EDIT_FLAG, originals } from "../components/SiteContent";
import { Button, INPUT, useNatural } from "./ui";
import { MediaPicker } from "./MediaAdmin";

// The visual editor. While it's on, clicking any text or image on the website opens a box to change it on
// this page or on every page. Links and buttons don't navigate while editing; use "Browse" mode to move around.

const norm = (s) => s.replace(/\s+/g, " ").trim();

function textNodeAt(e) {
  const pos = document.caretPositionFromPoint?.(e.clientX, e.clientY);
  const range = pos ? { node: pos.offsetNode } : document.caretRangeFromPoint ? { node: document.caretRangeFromPoint(e.clientX, e.clientY)?.startContainer } : {};
  if (range.node?.nodeType === Node.TEXT_NODE && norm(range.node.nodeValue)) return range.node;
  const walk = document.createTreeWalker(e.target, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) if (norm(n.nodeValue)) return n;
  return null;
}

// The size an image is shown at on this screen (CSS px), i.e. the spot a replacement has to fill.
const spotOf = (img) => {
  const r = img.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height) };
};
const ratio = (w, h) => (w && h ? w / h : 0);
const fileName = (src) => decodeURIComponent(String(src).split("/").pop().split("?")[0]).slice(0, 40);

// What to upload for a spot, and how the chosen file will fit it.
function SizeAdvice({ box, original, value }) {
  const orig = useNatural(original);
  const next = useNatural(value);
  if (!box?.w) return null;
  const want = { w: box.w * 2, h: box.h * 2 }; // 2x for sharp high-density screens
  const off = next && ratio(box.w, box.h) && Math.abs(ratio(next.w, next.h) / ratio(box.w, box.h) - 1) > 0.08;
  const small = next && (next.w < box.w || next.h < box.h);
  return (
    <div className="mt-4 space-y-1.5 rounded-lg bg-[#F5F8FD] p-3 text-[13px] leading-5 text-[#404348]">
      <p>
        <b>This spot:</b> {box.w} × {box.h} px on this screen. <b>Best upload:</b> {want.w} × {want.h} px or larger, same shape.
      </p>
      {orig && (
        <p>
          Current file: {orig.w} × {orig.h} px{next && value !== original ? ` · New file: ${next.w} × ${next.h} px` : ""}
        </p>
      )}
      {off && <p className="text-[#9A5B00]">The new image is a different shape, so it will be cropped to fit this spot.</p>}
      {small && <p className="text-[#C81E1E]">The new image is smaller than the spot, so it may look blurry.</p>}
    </div>
  );
}

const STYLE = `body.cube-editing #root *:hover:not(:has(*:hover)) { outline: 2px dashed #00B8FF !important; outline-offset: 2px; cursor: pointer !important; }`;

export default function EditLayer({ path, overrides, setOverrides }) {
  const [admin, setAdmin] = useState(null);
  const [browse, setBrowse] = useState(false);
  const [target, setTarget] = useState(null); // { kind, original, value, scope }
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hover, setHover] = useState(null); // size badge for the image under the pointer
  const [list, setList] = useState(null); // "Images on this page"

  useEffect(() => {
    api("/admin/me")
      .then(({ admin: a }) => setAdmin(a))
      .catch(() => {
        try {
          sessionStorage.removeItem(EDIT_FLAG);
        } catch {
          /* ignore */
        }
      });
  }, []);

  const active = admin && !browse && !target;
  useEffect(() => {
    if (!active) return undefined;
    const style = Object.assign(document.createElement("style"), { textContent: STYLE });
    document.head.appendChild(style);
    document.body.classList.add("cube-editing");
    const onClick = (e) => {
      if (e.target.closest("[data-cube-ui]")) return;
      e.preventDefault();
      e.stopPropagation();
      const img = e.target.closest("img");
      if (img) return openImage(img);
      const node = textNodeAt(e);
      if (!node) return toast.info("Nothing to edit here. Click on text or an image.");
      const shown = norm(node.nodeValue);
      const prev = originals.get(node);
      const original = prev && prev.shown === shown ? prev.original : shown;
      setTarget({ kind: "text", original, value: shown, scope: path });
    };
    const onMove = (e) => {
      const img = e.target.closest?.("img");
      if (!img || img.closest("[data-cube-ui]")) return setHover((h) => (h ? null : h));
      const box = spotOf(img);
      setHover({ x: e.clientX, y: e.clientY, ...box });
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mousemove", onMove);
      setHover(null);
      document.body.classList.remove("cube-editing");
      style.remove();
    };
    // openImage only reads `path` and state setters, so re-binding on `path` keeps it current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, path]);

  if (!admin) return null;

  function openImage(img) {
    const prev = originals.get(img);
    const src = img.getAttribute("src");
    const original = prev && prev.shown === src ? prev.original : src;
    setList(null);
    setTarget({ kind: "image", original, value: src, scope: path, box: spotOf(img) });
  }

  const showList = () => {
    const imgs = [...document.querySelectorAll("#root img")].filter((im) => !im.closest("[data-cube-ui]") && im.getBoundingClientRect().width > 0);
    setList(imgs.map((im) => ({ el: im, src: im.getAttribute("src"), box: spotOf(im), file: im.naturalWidth ? { w: im.naturalWidth, h: im.naturalHeight } : null })));
  };

  const existing = target && overrides.find((o) => o.kind === target.kind && o.original === target.original && o.scope === target.scope);

  const save = async () => {
    setBusy(true);
    try {
      const body = { kind: target.kind, scope: target.scope, original: target.original, replacement: target.kind === "text" ? norm(target.value) : target.value };
      if (target.kind === "image" && target.box?.w) Object.assign(body, { width: target.box.w, height: target.box.h });
      await api("/admin/overrides", { method: "POST", body });
      setOverrides([...overrides.filter((o) => !(o.kind === body.kind && o.original === body.original && o.scope === body.scope)), body]);
      toast.success(target.scope === "*" ? "Saved on every page" : "Saved on this page");
      setTarget(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setBusy(true);
    try {
      const { overrides: all } = await api("/admin/overrides");
      const row = all.find((o) => o.kind === target.kind && o.original === target.original && o.scope === target.scope);
      if (row) await api(`/admin/overrides/${row.id}`, { method: "DELETE" });
      // The page still shows the edited version until it is drawn again.
      toast.success("Restored. Reloading the page...");
      setTimeout(() => window.location.reload(), 600);
    } catch (e) {
      toast.error(e.message);
      setBusy(false);
    }
  };

  const stop = () => {
    try {
      sessionStorage.removeItem(EDIT_FLAG);
    } catch {
      /* ignore */
    }
    window.location.assign("/admin/content");
  };

  return (
    <div data-cube-ui="">
      <div className="fixed left-1/2 top-3 z-[10001] flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-[#0A0626] p-1.5 pl-4 text-[13px] text-white shadow-[0_20px_40px_-12px_rgb(0_0_0/0.6)]">
        <span className="hidden sm:inline">{browse ? "Browsing. Switch back to edit." : "Editing: click any text or image."}</span>
        <button
          type="button"
          onClick={() => setBrowse((b) => !b)}
          className={`rounded-xl px-3 py-1.5 font-medium transition-colors ${browse ? "bg-[#00B8FF] text-[#0A0626]" : "bg-white/10 hover:bg-white/20"}`}
        >
          {browse ? "Edit" : "Browse"}
        </button>
        <button type="button" onClick={() => (list ? setList(null) : showList())} className="rounded-xl bg-white/10 px-3 py-1.5 font-medium hover:bg-white/20">
          Images on this page
        </button>
        <button type="button" onClick={stop} className="rounded-xl bg-primary px-3 py-1.5 font-medium hover:bg-[#2300DC]">
          Done
        </button>
      </div>

      {hover && !target && !list && (
        <div className="pointer-events-none fixed z-[10003] rounded-md bg-[#0A0626] px-2 py-1 font-mono text-[11px] text-white shadow-lg" style={{ left: hover.x + 14, top: hover.y + 14 }}>
          {hover.w} × {hover.h} px · upload {hover.w * 2} × {hover.h * 2}
        </div>
      )}

      {list && (
        <div className="fixed right-3 top-16 z-[10002] max-h-[75vh] w-[360px] max-w-[calc(100vw-24px)] overflow-y-auto rounded-2xl bg-white p-3 text-[#0A0626] shadow-2xl">
          <p className="px-2 pb-2 text-[13px] font-medium">Images on this page ({list.length})</p>
          {list.length === 0 && <p className="px-2 pb-2 text-[13px] text-[#6B6E75]">No images on this page.</p>}
          <ul className="space-y-1">
            {list.map((im, k) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => {
                    im.el.scrollIntoView({ block: "center" });
                    openImage(im.el);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[#F0F4FB]"
                >
                  <img src={im.src} alt="" className="h-10 w-14 shrink-0 rounded bg-[#F5F8FD] object-contain" />
                  <span className="min-w-0 text-[12px] leading-4">
                    <span className="block truncate font-medium">{fileName(im.src)}</span>
                    <span className="block text-[#6B6E75]">
                      Spot {im.box.w} × {im.box.h} px{im.file ? ` · file ${im.file.w} × ${im.file.h}` : ""}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {target && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-[#0A0626]/50 p-4" role="dialog" aria-modal="true" aria-label="Edit content">
          <div className="w-full max-w-[560px] rounded-2xl bg-white p-6 text-[#0A0626] shadow-2xl">
            <h2 className="text-[18px] font-medium">{target.kind === "text" ? "Change this text" : "Change this image"}</h2>
            {target.kind === "text" ? (
              <>
                <p className="mt-3 text-[12px] uppercase tracking-[0.08em] text-[#6B6E75]">Original</p>
                <p className="mt-1 max-h-24 overflow-y-auto rounded-lg bg-[#F5F8FD] p-3 text-[14px] text-[#404348]">{target.original}</p>
                <label className="mt-4 block text-[12px] uppercase tracking-[0.08em] text-[#6B6E75]" htmlFor="cube-edit-text">
                  New text
                </label>
                <textarea id="cube-edit-text" autoFocus rows={4} maxLength={5000} value={target.value} onChange={(e) => setTarget({ ...target, value: e.target.value })} className={`${INPUT} mt-1`} />
              </>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <figure>
                  <img src={target.original} alt="" className="aspect-video w-full rounded-lg bg-[#F5F8FD] object-contain" />
                  <figcaption className="mt-1 text-[12px] text-[#6B6E75]">Original</figcaption>
                </figure>
                <figure>
                  <img src={target.value} alt="" className="aspect-video w-full rounded-lg bg-[#F5F8FD] object-contain" />
                  <figcaption className="mt-1 text-[12px] text-[#6B6E75]">New</figcaption>
                </figure>
                <Button variant="ghost" className="col-span-2" onClick={() => setPicking(true)}>
                  Choose or upload an image
                </Button>
                <div className="col-span-2 -mt-4">
                  <SizeAdvice box={target.box} original={target.original} value={target.value} />
                </div>
              </div>
            )}
            <fieldset className="mt-4 flex flex-wrap gap-4 text-[14px]">
              <legend className="sr-only">Where to apply</legend>
              {[
                [path, `Only on this page (${path})`],
                ["*", "On every page"],
              ].map(([v, l]) => (
                <label key={v} className="flex items-center gap-2">
                  <input type="radio" name="cube-scope" checked={target.scope === v} onChange={() => setTarget({ ...target, scope: v })} className="accent-[#0047FF]" />
                  {l}
                </label>
              ))}
            </fieldset>
            <div className="mt-6 flex flex-wrap justify-between gap-2">
              <div>
                {existing && (
                  <Button variant="danger" disabled={busy} onClick={reset}>
                    Restore original
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setTarget(null)}>
                  Cancel
                </Button>
                <Button disabled={busy || (target.kind === "text" && !norm(target.value))} onClick={save}>
                  {busy ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onPick={(url) => {
            setTarget({ ...target, value: url });
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}
