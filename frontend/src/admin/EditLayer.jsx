import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, LayoutGrid, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { isVideo, setContent, useContent } from "../lib/content";
import { EDIT_FLAG, ICONS, mounted, watchMounted } from "../lib/editable";
import { originals } from "../components/SiteContent";
import { Media } from "../components/MediaSlot";
import { Button, INPUT, useNatural } from "./ui";
import { ACCEPT_NOTE, MediaPicker } from "./MediaAdmin";

// The visual editor. While it's on, clicking any text, picture or animation on the website opens a box to
// change it on this page or on every page, and every card list gets an "Edit cards" button to add, remove,
// reorder and rewrite its cards. Links and buttons don't navigate while editing; use "Browse" to move around.

const norm = (s) => s.replace(/\s+/g, " ").trim();

function textNodeAt(e) {
  const pos = document.caretPositionFromPoint?.(e.clientX, e.clientY);
  const range = pos ? { node: pos.offsetNode } : document.caretRangeFromPoint ? { node: document.caretRangeFromPoint(e.clientX, e.clientY)?.startContainer } : {};
  if (range.node?.nodeType === Node.TEXT_NODE && norm(range.node.nodeValue)) return range.node;
  const walk = document.createTreeWalker(e.target, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) if (norm(n.nodeValue)) return n;
  return null;
}

// The size something is shown at on this screen (CSS px), i.e. the spot a replacement has to fill. Animation
// spots have no box of their own (display: contents), so their first visible child is measured.
const boxOf = (el) => {
  const els = getComputedStyle(el).display === "contents" ? [...el.children] : [el];
  const r = els.map((c) => c.getBoundingClientRect()).find((x) => x.width > 0) || { width: 0, height: 0 };
  return { w: Math.round(r.width), h: Math.round(r.height) };
};
const ratio = (w, h) => (w && h ? w / h : 0);
const fileName = (src) => decodeURIComponent(String(src).split("/").pop().split("?")[0]).slice(0, 40);
const videoSrc = (v) => originals.get(v)?.shown || v.getAttribute("src") || v.querySelector("source")?.getAttribute("src");
const videoOriginal = (v) => originals.get(v)?.original || v.getAttribute("src") || v.querySelector("source")?.getAttribute("src");

// What to upload for a spot, and how the chosen file will fit it.
function SizeAdvice({ box, original, value }) {
  const orig = useNatural(original && !original.startsWith("slot:") && !isVideo(original) ? original : null);
  const next = useNatural(value && !value.startsWith("slot:") && !isVideo(value) ? value : null);
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
      {off && <p className="text-[#9A5B00]">The new picture is a different shape, so it will be cropped to fit this spot.</p>}
      {small && <p className="text-[#C81E1E]">The new picture is smaller than the spot, so it may look blurry.</p>}
      <p className="text-[12px] text-[#6B6E75]">{ACCEPT_NOTE}</p>
    </div>
  );
}

// The current version of a spot: a placeholder for a built-in animation, else the picture or video.
function Preview({ src, label }) {
  if (!src || src.startsWith("slot:"))
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-lg bg-[#0A0626] text-[12px] text-[#A9B3CC]">
        <Sparkles size={20} className="text-[#00B8FF]" /> Built-in animation
      </div>
    );
  return <Media src={src} alt={label} className="aspect-video w-full rounded-lg bg-[#F5F8FD] object-contain" />;
}

// --- Card lists ----------------------------------------------------------------------------------------
const KIND_LABEL = { features: "Feature cards", steps: "Steps", checklist: "List items", tiles: "Tiles", faq: "Questions", products: "Product cards" };
const BLANK = {
  features: { icon: "", title: "", desc: "" },
  steps: { icon: "", title: "", desc: "" },
  checklist: "",
  tiles: "",
  faq: { q: "", a: "" },
  products: { title: "", tag: "", tagline: "", img: "", href: "/" },
};
const filled = (kind, it) =>
  typeof it === "string" ? Boolean(it.trim()) : kind === "faq" ? Boolean(it.q.trim() && it.a.trim()) : kind === "products" ? Boolean(it.title.trim() && /^(\/|https:\/\/)/.test(it.href)) : Boolean(it.title.trim());

function CardFields({ kind, it, set, pickImage }) {
  const field = (k, label, props = {}) => (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-[#404348]">{label}</span>
      {props.rows ? (
        <textarea value={it[k]} onChange={(e) => set({ ...it, [k]: e.target.value })} className={INPUT} {...props} />
      ) : (
        <input value={it[k]} onChange={(e) => set({ ...it, [k]: e.target.value })} className={INPUT} {...props} />
      )}
    </label>
  );
  if (typeof it === "string") return <input value={it} maxLength={kind === "tiles" ? 160 : 300} onChange={(e) => set(e.target.value)} className={INPUT} aria-label="Text" />;
  if (kind === "faq")
    return (
      <div className="grid gap-2">
        {field("q", "Question", { maxLength: 300 })}
        {field("a", "Answer", { maxLength: 2000, rows: 3 })}
      </div>
    );
  if (kind === "products")
    return (
      <div className="grid gap-3 sm:grid-cols-[132px_1fr]">
        <div>
          <button type="button" onClick={pickImage} className="relative flex aspect-[9/5] w-full items-center justify-center overflow-hidden rounded-lg bg-[#F0F4FB] text-[#6B6E75]" aria-label="Choose the card's picture">
            {it.img ? <img src={it.img} alt="" className="h-full w-full object-contain" /> : <ImagePlus size={20} />}
          </button>
          <p className="mt-1 text-center text-[11px] text-[#6B6E75]">1080 × 600 px, or GIF</p>
          {it.img && (
            <button type="button" onClick={() => set({ ...it, img: "" })} className="w-full text-center text-[11px] text-[#C81E1E] hover:underline">
              Remove picture
            </button>
          )}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {field("title", "Title", { maxLength: 120 })}
          {field("tag", "Small label", { maxLength: 40 })}
          <div className="sm:col-span-2">{field("tagline", "Short text", { maxLength: 300, rows: 2 })}</div>
          <div className="sm:col-span-2">{field("href", "Link (a page like /services/co-browsing, or https://...)", { maxLength: 300 })}</div>
        </div>
      </div>
    );
  const Icon = ICONS.get(it.icon);
  return (
    <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
      <label className="block">
        <span className="mb-1 block text-[12px] font-medium text-[#404348]">Icon</span>
        <span className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">{Icon ? <Icon size={17} /> : null}</span>
          <select value={it.icon} onChange={(e) => set({ ...it, icon: e.target.value })} className={INPUT}>
            <option value="">No icon</option>
            {[...ICONS.keys()].sort().map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </span>
      </label>
      <div className="grid gap-2">
        {field("title", "Title", { maxLength: 160 })}
        {field("desc", "Text", { maxLength: 600, rows: 2 })}
      </div>
    </div>
  );
}

function ListEditor({ group, path, onClose }) {
  const { key, kind } = group;
  const { lists } = useContent();
  const saved = lists.find((l) => l.key === key && l.scope === path) || lists.find((l) => l.key === key && l.scope === "*");
  const [scope, setScope] = useState(saved?.scope || (kind === "products" ? "*" : path));
  const [items, setItems] = useState(() => (saved ? saved.items : group.items));
  const [picking, setPicking] = useState(null); // index of the card choosing a picture
  const [busy, setBusy] = useState(false);

  const set = (i, v) => setItems((all) => all.map((it, k) => (k === i ? v : it)));
  const move = (i, d) =>
    setItems((all) => {
      const next = [...all];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });
  const ready = items.length > 0 && items.every((it) => filled(kind, it));

  const save = async () => {
    setBusy(true);
    try {
      await api("/admin/lists", { method: "PUT", body: { scope, key, items } });
      setContent({ lists: [...lists.filter((l) => !(l.key === key && l.scope === scope)), { scope, key, items }] });
      toast.success(scope === "*" ? "Cards saved on every page" : "Cards saved on this page");
      onClose();
    } catch (e) {
      toast.error(e.message);
      setBusy(false);
    }
  };
  const restore = async () => {
    if (!window.confirm("Go back to the original cards? Your changes to this list are removed.")) return;
    setBusy(true);
    try {
      const { lists: rows } = await api("/admin/lists");
      for (const row of rows.filter((r) => r.key === key && (r.scope === path || r.scope === "*"))) await api(`/admin/lists/${row.id}`, { method: "DELETE" });
      setContent({ lists: lists.filter((l) => !(l.key === key && (l.scope === path || l.scope === "*"))) });
      toast.success("Original cards restored");
      onClose();
    } catch (e) {
      toast.error(e.message);
      setBusy(false);
    }
  };

  return (
    <div data-cube-ui="" className="fixed inset-0 z-[10002] flex items-center justify-center bg-[#0A0626]/50 p-4" role="dialog" aria-modal="true" aria-label="Edit cards">
      <div className="flex max-h-[90vh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl bg-white text-[#0A0626] shadow-2xl">
        <header className="border-b border-[#EEF1F7] px-6 py-4">
          <h2 className="text-[18px] font-medium">Edit {KIND_LABEL[kind].toLowerCase()}</h2>
          <p className="mt-0.5 text-[13px] text-[#6B6E75]">Add, remove, reorder or rewrite them. Changes show on the site as soon as you save.</p>
        </header>
        <ol className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
          {items.map((it, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-[#E5EAF4] p-3">
              <span className="mt-1 font-mono text-[12px] text-[#9CA3AF]">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <CardFields kind={kind} it={it} set={(v) => set(i, v)} pickImage={() => setPicking(i)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Button variant="ghost" className="px-2" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                  <ArrowUp size={14} />
                </Button>
                <Button variant="ghost" className="px-2" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                  <ArrowDown size={14} />
                </Button>
                <Button variant="danger" className="px-2" disabled={items.length === 1} onClick={() => setItems((all) => all.filter((_, k) => k !== i))} aria-label="Remove">
                  <Trash2 size={14} />
                </Button>
              </div>
            </li>
          ))}
          <li>
            <Button variant="ghost" className="w-full" onClick={() => setItems((all) => [...all, typeof BLANK[kind] === "string" ? "" : { ...BLANK[kind] }])}>
              <Plus size={15} /> Add {kind === "faq" ? "a question" : kind === "checklist" || kind === "tiles" ? "an item" : kind === "steps" ? "a step" : "a card"}
            </Button>
          </li>
        </ol>
        <footer className="border-t border-[#EEF1F7] px-6 py-4">
          <fieldset className="flex flex-wrap gap-4 text-[14px]">
            <legend className="sr-only">Where to apply</legend>
            {[
              [path, `Only on this page (${path})`],
              ["*", "On every page that shows these cards"],
            ].map(([v, l]) => (
              <label key={v} className="flex items-center gap-2">
                <input type="radio" name="cube-list-scope" checked={scope === v} onChange={() => setScope(v)} className="accent-[#0047FF]" />
                {l}
              </label>
            ))}
          </fieldset>
          <div className="mt-4 flex flex-wrap justify-between gap-2">
            <div>
              {saved && (
                <Button variant="danger" disabled={busy} onClick={restore}>
                  Restore original
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={busy || !ready} onClick={save} title={ready ? undefined : "Fill in every card's required fields first"}>
                {busy ? "Saving..." : "Save cards"}
              </Button>
            </div>
          </div>
        </footer>
      </div>
      {picking !== null && (
        <MediaPicker
          imagesOnly
          onClose={() => setPicking(null)}
          onPick={(url) => {
            setItems((all) => all.map((it, k) => (k === picking ? { ...it, img: url } : it)));
            setPicking(null);
          }}
        />
      )}
    </div>
  );
}

const STYLE = `body.cube-editing #root *:hover:not(:has(*:hover)) { outline: 2px dashed #00B8FF !important; outline-offset: 2px; cursor: pointer !important; }`;

export default function EditLayer({ path, overrides, setOverrides }) {
  const [admin, setAdmin] = useState(null);
  const [browse, setBrowse] = useState(false);
  const [target, setTarget] = useState(null); // { kind, what, original, value, scope, box, label }
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hover, setHover] = useState(null); // size badge for the picture under the pointer
  const [listHover, setListHover] = useState(null); // { key, top, right } for the "Edit cards" button
  const [panel, setPanel] = useState(null); // "media" | "cards"
  const [group, setGroup] = useState(null); // card list being edited
  const [, refresh] = useState(0);

  useEffect(() => watchMounted(() => refresh((n) => n + 1)), []);
  useEffect(() => {
    api("/admin/me")
      .then(({ admin: a }) => {
        if (!a.permissions.includes("content")) throw new Error("no access");
        setAdmin(a);
      })
      .catch(() => {
        try {
          sessionStorage.removeItem(EDIT_FLAG);
        } catch {
          /* ignore */
        }
      });
  }, []);

  const active = admin && !browse && !target && !group;
  useEffect(() => {
    if (!active) return undefined;
    const style = Object.assign(document.createElement("style"), { textContent: STYLE });
    document.head.appendChild(style);
    document.body.classList.add("cube-editing");
    const onClick = (e) => {
      if (e.target.closest("[data-cube-ui]")) return;
      e.preventDefault();
      e.stopPropagation();
      const slot = e.target.closest("[data-cube-slot]");
      if (slot) return openSlot(slot);
      const video = e.target.closest("video");
      if (video) return openVideo(video);
      const img = e.target.closest("img");
      if (img) return openImage(img);
      const node = textNodeAt(e);
      if (!node) return toast.info("Nothing to edit here. Click on text, a picture or an animation.");
      const shown = norm(node.nodeValue);
      const prev = originals.get(node);
      const original = prev && prev.shown === shown ? prev.original : shown;
      setTarget({ kind: "text", original, value: shown, scope: path });
    };
    const onMove = (e) => {
      if (e.target.closest?.("[data-cube-ui]")) return;
      const list = e.target.closest?.("[data-cube-list]");
      const key = list?.getAttribute("data-cube-list");
      if (key && mounted.has(key)) {
        const r = list.getBoundingClientRect();
        setListHover((h) => (h?.key === key && h.top === Math.round(r.top) ? h : { key, top: Math.round(r.top), right: Math.round(r.right) }));
      } else setListHover((h) => (h ? null : h));
      const img = e.target.closest?.("img");
      if (!img) return setHover((h) => (h ? null : h));
      setHover({ x: e.clientX, y: e.clientY, ...boxOf(img) });
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mousemove", onMove);
      setHover(null);
      setListHover(null);
      document.body.classList.remove("cube-editing");
      style.remove();
    };
    // the open* helpers only read `path` and state setters, so re-binding on `path` keeps them current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, path]);

  if (!admin) return null;

  const openMedia = (t) => {
    setPanel(null);
    setTarget({ kind: "image", scope: path, ...t });
  };
  function openImage(img) {
    const prev = originals.get(img);
    const src = img.getAttribute("src");
    const original = prev && prev.shown === src ? prev.original : src;
    openMedia({ what: "image", original, value: src, box: boxOf(img), label: img.alt });
  }
  function openVideo(v) {
    openMedia({ what: "video", original: videoOriginal(v), value: videoSrc(v), box: boxOf(v) });
  }
  function openSlot(el) {
    const original = `slot:${el.getAttribute("data-cube-slot")}`;
    const edit = overrides.find((o) => o.kind === "image" && o.original === original && (o.scope === path || o.scope === "*"));
    openMedia({ what: "slot", original, value: edit?.replacement || original, box: boxOf(el), scope: edit?.scope || path });
  }
  const openList = (key) => {
    const g = mounted.get(key);
    if (!g) return;
    setPanel(null);
    document.querySelector(`[data-cube-list="${key}"]`)?.scrollIntoView({ block: "center" });
    setGroup({ key, ...g });
  };

  // Everything on the page that shows a picture or an animation, for "Pictures & animations".
  const spots = () => {
    const visible = (el) => !el.closest("[data-cube-ui]") && boxOf(el).w > 0;
    return [
      ...[...document.querySelectorAll("#root [data-cube-slot]")].filter(visible).map((el) => ({ el, kind: "Animation", src: null, open: () => openSlot(el) })),
      ...[...document.querySelectorAll("#root video")].filter(visible).map((el) => ({ el, kind: "Video", src: videoSrc(el), open: () => openVideo(el) })),
      // Decorative copies (e.g. the blurred backdrop behind a product photo) change along with their photo.
      ...[...document.querySelectorAll("#root img:not([aria-hidden='true'])")]
        .filter((el) => visible(el) && !el.closest("[data-cube-slot]") && !el.hasAttribute("data-cube-swap"))
        .map((el) => ({ el, kind: "Picture", src: el.getAttribute("src"), open: () => openImage(el) })),
    ];
  };

  const existing = target && overrides.find((o) => o.kind === target.kind && o.original === target.original && o.scope === target.scope);
  const isSlot = target?.what === "slot";

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

  const toolButton = (on) => `rounded-xl px-3 py-1.5 font-medium transition-colors ${on ? "bg-[#00B8FF] text-[#0A0626]" : "bg-white/10 hover:bg-white/20"}`;
  const cardGroups = [...mounted.entries()];
  const title = target?.kind === "text" ? "Change this text" : isSlot ? "Change this animation" : target?.what === "video" ? "Change this video" : "Change this picture";

  return (
    <div data-cube-ui="">
      <div className="fixed left-1/2 top-3 z-[10001] flex max-w-[calc(100vw-16px)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl bg-[#0A0626] p-1.5 pl-4 text-[13px] text-white shadow-[0_20px_40px_-12px_rgb(0_0_0/0.6)]">
        <span className="hidden 2xl:inline">{browse ? "Browsing. Switch back to edit." : "Editing: click any text, picture or animation."}</span>
        <button type="button" onClick={() => setBrowse((b) => !b)} className={toolButton(browse)}>
          {browse ? "Edit" : "Browse"}
        </button>
        <button type="button" onClick={() => setPanel((p) => (p === "media" ? null : "media"))} className={toolButton(panel === "media")}>
          Pictures &amp; animations
        </button>
        <button type="button" onClick={() => setPanel((p) => (p === "cards" ? null : "cards"))} className={toolButton(panel === "cards")}>
          Cards on this page ({cardGroups.length})
        </button>
        <button type="button" onClick={stop} className="rounded-xl bg-primary px-3 py-1.5 font-medium hover:bg-[#2300DC]">
          Done
        </button>
      </div>

      {hover && !target && !panel && !group && (
        <div className="pointer-events-none fixed z-[10003] rounded-md bg-[#0A0626] px-2 py-1 font-mono text-[11px] text-white shadow-lg" style={{ left: hover.x + 14, top: hover.y + 14 }}>
          {hover.w} × {hover.h} px · upload {hover.w * 2} × {hover.h * 2}
        </div>
      )}

      {listHover && active && (
        <button
          type="button"
          onClick={() => openList(listHover.key)}
          className="fixed z-[10003] flex items-center gap-1.5 rounded-full bg-[#00B8FF] px-3 py-1.5 text-[12px] font-semibold text-[#0A0626] shadow-lg hover:bg-white"
          style={{ top: Math.max(listHover.top + 8, 64), left: Math.max(listHover.right - 150, 8) }}
        >
          <LayoutGrid size={14} /> Edit these cards
        </button>
      )}

      {panel && (
        <div className="fixed right-3 top-16 z-[10002] max-h-[75vh] w-[380px] max-w-[calc(100vw-24px)] overflow-y-auto rounded-2xl bg-white p-3 text-[#0A0626] shadow-2xl">
          {panel === "media" ? (
            (() => {
              const list = spots();
              return (
                <>
                  <p className="px-2 pb-2 text-[13px] font-medium">Pictures &amp; animations on this page ({list.length})</p>
                  {list.length === 0 && <p className="px-2 pb-2 text-[13px] text-[#6B6E75]">Nothing here.</p>}
                  <ul className="space-y-1">
                    {list.map((s, k) => (
                      <li key={k}>
                        <button
                          type="button"
                          onClick={() => {
                            s.el.scrollIntoView({ block: "center" });
                            s.open();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[#F0F4FB]"
                        >
                          {s.src ? <Media src={s.src} className="h-10 w-14 shrink-0 rounded bg-[#F5F8FD] object-contain" /> : <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded bg-[#0A0626] text-[#00B8FF]"><Sparkles size={16} /></span>}
                          <span className="min-w-0 text-[12px] leading-4">
                            <span className="block truncate font-medium">{s.kind}{s.src ? ` · ${fileName(s.src)}` : ""}</span>
                            <span className="block text-[#6B6E75]">
                              Spot {boxOf(s.el).w} × {boxOf(s.el).h} px
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              );
            })()
          ) : (
            <>
              <p className="px-2 pb-2 text-[13px] font-medium">Card lists on this page ({cardGroups.length})</p>
              {cardGroups.length === 0 && <p className="px-2 pb-2 text-[13px] text-[#6B6E75]">No editable card lists on this page.</p>}
              <ul className="space-y-1">
                {cardGroups.map(([key, g]) => (
                  <li key={key}>
                    <button type="button" onClick={() => openList(key)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[#F0F4FB]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-primary">
                        <LayoutGrid size={16} />
                      </span>
                      <span className="min-w-0 text-[12px] leading-4">
                        <span className="block font-medium">
                          {KIND_LABEL[g.kind]} ({g.items.length})
                        </span>
                        <span className="block truncate text-[#6B6E75]">Starts with “{g.label}”</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {target && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-[#0A0626]/50 p-4" role="dialog" aria-modal="true" aria-label={title}>
          <div className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white p-6 text-[#0A0626] shadow-2xl">
            <h2 className="text-[18px] font-medium">{title}</h2>
            {target.kind === "text" ? (
              <>
                <p className="mt-3 text-[12px] uppercase tracking-[0.08em] text-[#6B6E75]">Original</p>
                <p className="mt-1 max-h-24 overflow-y-auto rounded-lg bg-[#F5F8FD] p-3 text-[14px] text-[#404348]">{target.original}</p>
                <label className="mt-4 block text-[12px] uppercase tracking-[0.08em] text-[#6B6E75]" htmlFor="cube-edit-text">
                  New text
                </label>
                <textarea id="cube-edit-text" autoFocus rows={4} maxLength={5000} value={target.value} onChange={(e) => setTarget((t) => ({ ...t, value: e.target.value }))} className={`${INPUT} mt-1`} />
              </>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <figure>
                  <Preview src={target.original} label="Original" />
                  <figcaption className="mt-1 text-[12px] text-[#6B6E75]">Original</figcaption>
                </figure>
                <figure>
                  <Preview src={target.value} label="New" />
                  <figcaption className="mt-1 text-[12px] text-[#6B6E75]">New</figcaption>
                </figure>
                <Button variant="ghost" className="col-span-2" onClick={() => setPicking(true)}>
                  {target.what === "image" ? "Choose or upload a picture or GIF" : "Choose or upload a video, GIF or picture"}
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
                  <input type="radio" name="cube-scope" checked={target.scope === v} onChange={() => setTarget((t) => ({ ...t, scope: v }))} className="accent-[#0047FF]" />
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
                <Button variant="ghost" onClick={() => (setPicking(false), setTarget(null))}>
                  Cancel
                </Button>
                <Button disabled={busy || (target.kind === "text" ? !norm(target.value) : target.value === target.original)} onClick={save}>
                  {busy ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Above the edit box (z-index), and tied to it: picking writes into the box that is open now. */}
      {picking && target && (
        <MediaPicker
          imagesOnly={target.what === "image"}
          onClose={() => setPicking(false)}
          onPick={(url) => {
            setTarget((t) => t && { ...t, value: url });
            setPicking(false);
          }}
        />
      )}
      {group && <ListEditor key={group.key} group={group} path={path} onClose={() => setGroup(null)} />}
    </div>
  );
}
