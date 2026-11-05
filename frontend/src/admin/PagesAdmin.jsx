import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Copy, ExternalLink, ImagePlus, LayoutTemplate, PencilLine, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { ICONS } from "../lib/editable";
import { Button, Card, Empty, Field, INPUT, PageTitle, Toggle, act, useResource, utcStamp } from "./ui";
import { startEditing } from "./ContentAdmin";
import { DEFAULT_OFF } from "../components/PageGate";
import ROUTES from "../seo/routes.json";
import { MediaPicker } from "./MediaAdmin";
import { COPY_GROUPS, LAYOUTS, SAMPLE, copyPage } from "./blueprints";

// Build new pages for the website without code. A page has a top section (hero), any number of sections
// and a closing call to action, and is drawn with the same layout as the site's own product pages: the
// layout of each section follows from what it holds (text, a list, cards, numbered steps, a picture).

const toParas = (s) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const toLines = (s) => s.split("\n").map((p) => p.trim()).filter(Boolean);
const BLANK_CARD = { icon: "", title: "", desc: "" };
const BLANK_SECTION = { label: "", title: "", body: "", list: "", image: "", button: "", steps: false, dark: false, cards: [], numbered: "", faqs: [], tiles: [] };
const BLANK_PAGE = {
  id: null,
  path: "/services/",
  title: "",
  description: "",
  published: false,
  hero: { label: "", title: "", body: "", list: "", image: "", button: "Book a demo", scene: "", stats: [], tiles: [] },
  sections: [{ ...BLANK_SECTION }],
  cta: { title: "", body: "", button: "Book a Free Demo" },
  related: true,
};

// Database row -> editor fields (paragraphs and lists as plain text boxes).
export function fromRow(p) {
  const c = p.content;
  const text = (s) => ({ ...s, body: (s.body || []).join("\n\n"), list: (s.list || []).join("\n") });
  return {
    id: p.id,
    path: p.path,
    title: p.title,
    description: p.description,
    published: p.published,
    hero: { ...BLANK_PAGE.hero, ...text(c.hero) },
    sections: c.sections.map((s) => ({ ...BLANK_SECTION, ...text(s), cards: s.cards || [], numbered: (s.numbered || []).join("\n") })),
    cta: c.cta ? { ...c.cta, body: (c.cta.body || []).join("\n\n") } : { title: "", body: "", button: "" },
    related: c.related,
  };
}

// Editor fields -> what the server stores. Empty optional parts are left out.
function toBody(f, published = f.published) {
  const para = (s) => ({ ...s, body: toParas(s.body), list: toLines(s.list) });
  const some = (rows, key) => (rows || []).filter((r) => (r[key] || "").trim());
  const hasContent = (s) => s.title.trim() || s.body.trim() || s.list.trim() || s.image || s.numbered.trim() || some(s.cards, "title").length || some(s.faqs, "q").length || some(s.tiles, "label").length;
  return {
    path: f.path.trim(),
    title: f.title.trim(),
    description: f.description.trim(),
    published,
    content: {
      hero: { ...para(f.hero), body: toParas(f.hero.body).slice(0, 4), stats: some(f.hero.stats, "value"), tiles: some(f.hero.tiles, "label") },
      // A section left completely empty is simply not part of the page.
      sections: f.sections.filter(hasContent).map((s) => ({ ...para(s), cards: some(s.cards, "title"), numbered: toLines(s.numbered), faqs: some(s.faqs, "q"), tiles: some(s.tiles, "label") })),
      cta: f.cta.title.trim() || f.cta.body.trim() ? { ...f.cta, body: toParas(f.cta.body).slice(0, 3) } : null,
      related: f.related,
    },
  };
}

export function IconSelect({ value, onChange }) {
  const Icon = ICONS.get(value);
  return (
    <span className="flex items-start gap-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">{Icon && <Icon size={16} />}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={INPUT} aria-label="Icon">
        <option value="">No icon</option>
        {[...ICONS.keys()].sort().map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </span>
  );
}

// A short list of rows: the numbers strip, an icon diagram, questions and answers.
function Rows({ label, hint, rows, blank, max, render, onChange, add }) {
  const set = (i, patch) => onChange(rows.map((r, k) => (k === i ? { ...r, ...patch } : r)));
  return (
    <div>
      <span className="mb-1 block text-[13px] font-medium text-[#404348]">{label}</span>
      {hint && <span className="mb-2 block text-[12px] text-[#6B6E75]">{hint}</span>}
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="grid min-w-0 flex-1 gap-2 md:grid-cols-[1fr_1.4fr]">{render(r, (patch) => set(i, patch))}</span>
            <Button variant="danger" className="px-2" onClick={() => onChange(rows.filter((_, k) => k !== i))} aria-label={`Remove from ${label}`}>
              <Trash2 size={14} />
            </Button>
          </li>
        ))}
      </ul>
      <Button variant="ghost" className="mt-2" disabled={rows.length >= max} onClick={() => onChange([...rows, { ...blank }])}>
        <Plus size={15} /> {add}
      </Button>
    </div>
  );
}

const TileRows = ({ rows, onChange }) => (
  <Rows
    label="Icon diagram (instead of a picture)"
    hint="Small labelled icons in a circle. Choosing a picture hides this."
    rows={rows}
    blank={{ icon: "", label: "" }}
    max={12}
    add="Add an icon"
    onChange={onChange}
    render={(r, set) => (
      <>
        <IconSelect value={r.icon} onChange={(icon) => set({ icon })} />
        <input placeholder="Label" value={r.label} maxLength={60} onChange={(e) => set({ label: e.target.value })} className={INPUT} aria-label="Icon label" />
      </>
    )}
  />
);

function Picture({ value, onPick, onClear, hint }) {
  const [picking, setPicking] = useState(false);
  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-medium text-[#404348]">Picture (optional)</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setPicking(true)} className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F0F4FB] text-[#6B6E75]" aria-label="Choose a picture">
          {value ? <img src={value} alt="" className="h-full w-full object-contain" /> : <ImagePlus size={20} />}
        </button>
        <div className="text-[12px] leading-5 text-[#6B6E75]">
          {hint}
          {value && (
            <button type="button" onClick={onClear} className="mt-1 block text-[#C81E1E] hover:underline">
              Remove picture
            </button>
          )}
        </div>
      </div>
      {picking && (
        <MediaPicker
          imagesOnly
          onClose={() => setPicking(false)}
          onPick={(url) => {
            onPick(url);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}

function Cards({ cards, onChange }) {
  const set = (i, patch) => onChange(cards.map((c, k) => (k === i ? { ...c, ...patch } : c)));
  const move = (i, d) => {
    const next = [...cards];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-medium text-[#404348]">Cards ({cards.length})</span>
      <ul className="space-y-2">
        {cards.map((c, i) => {
          return (
            <li key={i} className="grid gap-2 rounded-xl border border-[#E5EAF4] p-3 md:grid-cols-[170px_1fr_auto]">
              <IconSelect value={c.icon} onChange={(icon) => set(i, { icon })} />
              <span className="grid gap-2">
                <input placeholder="Card title" value={c.title} maxLength={160} onChange={(e) => set(i, { title: e.target.value })} className={INPUT} aria-label="Card title" />
                <textarea placeholder="Card text" rows={2} value={c.desc} maxLength={600} onChange={(e) => set(i, { desc: e.target.value })} className={INPUT} aria-label="Card text" />
              </span>
              <span className="flex gap-1.5 md:flex-col">
                <Button variant="ghost" className="px-2" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move card up">
                  <ArrowUp size={14} />
                </Button>
                <Button variant="ghost" className="px-2" disabled={i === cards.length - 1} onClick={() => move(i, 1)} aria-label="Move card down">
                  <ArrowDown size={14} />
                </Button>
                <Button variant="danger" className="px-2" onClick={() => onChange(cards.filter((_, k) => k !== i))} aria-label="Remove card">
                  <Trash2 size={14} />
                </Button>
              </span>
            </li>
          );
        })}
      </ul>
      <Button variant="ghost" className="mt-2" disabled={cards.length >= 24} onClick={() => onChange([...cards, { ...BLANK_CARD }])}>
        <Plus size={15} /> Add a card
      </Button>
    </div>
  );
}

export function Editor({ initial, onDone, backLabel = "Back to pages" }) {
  const [f, setF] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(initial.id ? initial.path : null); // the address it's stored at, once it is
  const hero = (patch) => setF({ ...f, hero: { ...f.hero, ...patch } });
  const section = (i, patch) => setF({ ...f, sections: f.sections.map((s, k) => (k === i ? { ...s, ...patch } : s)) });
  const moveSection = (i, d) => {
    const next = [...f.sections];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setF({ ...f, sections: next });
  };

  const save = async (published) => {
    const body = toBody(f, published);
    if (published && JSON.stringify([body.title, body.description, body.content]).includes(SAMPLE)) return toast.error(`Replace the sample text marked ${SAMPLE} before publishing. You can save a draft in the meantime.`);
    setBusy(true);
    const r = await act(
      () => (f.id ? api(`/admin/pages/${f.id}`, { method: "PUT", body }) : api("/admin/pages", { method: "POST", body })),
      published ? `Published. It's live at ${body.path}` : "Saved as a draft. Only signed-in admins can see it."
    );
    setBusy(false);
    if (!r) return;
    const id = f.id || r.id;
    setF({ ...f, id, published });
    setSaved(body.path);
  };
  const remove = async () =>
    window.confirm(`Delete the page ${f.path}? Visitors going there will be sent to the homepage.`) && (await act(() => api(`/admin/pages/${f.id}`, { method: "DELETE" }), "Page deleted")) && onDone(null);

  return (
    <>
      <PageTitle
        title={f.id ? `Edit ${f.path}` : "New page"}
        desc="Fill in what you need; empty boxes are simply left out. Each section's layout follows from what it holds: text, a list, cards, numbered steps or a picture."
        actions={
          <>
            <Button variant="ghost" onClick={() => onDone(saved)}>
              {backLabel}
            </Button>
            {f.id && (
              <a href={f.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE2EE] bg-white px-3.5 py-2 text-[14px] font-medium text-[#0A0626] hover:bg-[#F0F4FB]">
                {f.published ? "View page" : "Preview draft"} <ExternalLink size={14} />
              </a>
            )}
          </>
        }
      />

      <div className="space-y-6">
        <Card title="Address and search">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Web address" hint="Lowercase letters, numbers and hyphens, e.g. /services/co-browsing-pro. It can't be an address the site already uses.">
              <input value={f.path} maxLength={120} onChange={(e) => setF({ ...f, path: e.target.value.toLowerCase().replace(/[^a-z0-9/-]/g, "") })} className={`${INPUT} font-mono`} />
            </Field>
            <Field label="Browser-tab title" hint="Shown in the browser tab and on Google, e.g. “Co-Browsing | Cube Software”.">
              <input value={f.title} maxLength={120} onChange={(e) => setF({ ...f, title: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Search description" hint="One or two sentences for Google and link previews (up to 300 characters)." className="md:col-span-2">
              <textarea rows={2} value={f.description} maxLength={300} onChange={(e) => setF({ ...f, description: e.target.value })} className={INPUT} />
            </Field>
          </div>
        </Card>

        <Card title="Top of the page">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Small label above the headline" hint="e.g. Visual support">
              <input value={f.hero.label} maxLength={60} onChange={(e) => hero({ label: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Headline (required)" hint="Put words in [square brackets] to show them in the highlight colour.">
              <input value={f.hero.title} maxLength={160} onChange={(e) => hero({ title: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Introduction" hint="Leave a blank line between paragraphs. The first one is shown largest." className="md:col-span-2">
              <textarea rows={4} value={f.hero.body} onChange={(e) => hero({ body: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Bullet points (optional)" hint="One per line.">
              <textarea rows={3} value={f.hero.list} onChange={(e) => hero({ list: e.target.value })} className={INPUT} />
            </Field>
            <div className="space-y-4">
              <Field label="Button text" hint="The button opens the demo booking.">
                <input value={f.hero.button} maxLength={60} onChange={(e) => hero({ button: e.target.value })} className={INPUT} />
              </Field>
              <Picture
                value={f.hero.image}
                onPick={(image) => hero({ image, scene: "", tiles: [] })}
                onClear={() => hero({ image: "" })}
                hint={f.hero.scene ? "This page uses the moving illustration from the page it was copied from. Choosing a picture replaces it." : "Shown on the right, about 560 × 380 px: upload 1120 × 760 px or larger. Without one, the Cube animation shows."}
              />
            </div>
            <div className="md:col-span-2">
              <Rows
                label="Numbers strip (optional)"
                hint="Runs along the bottom of the top section, e.g. 35+ Years of Telephony."
                rows={f.hero.stats}
                blank={{ value: "", label: "" }}
                max={6}
                add="Add a number"
                onChange={(stats) => hero({ stats })}
                render={(r, set) => (
                  <>
                    <input placeholder="Number" value={r.value} maxLength={40} onChange={(e) => set({ value: e.target.value })} className={INPUT} aria-label="Number" />
                    <input placeholder="What it counts" value={r.label} maxLength={60} onChange={(e) => set({ label: e.target.value })} className={INPUT} aria-label="What it counts" />
                  </>
                )}
              />
            </div>
            {!f.hero.image && !f.hero.scene && (
              <div className="md:col-span-2">
                <TileRows rows={f.hero.tiles} onChange={(tiles) => hero({ tiles })} />
              </div>
            )}
          </div>
        </Card>

        {f.sections.map((s, i) => (
          <Card
            key={i}
            title={`Section ${i + 1}${s.title ? `: ${s.title}` : ""}`}
            actions={
              <>
                <Button variant="ghost" className="px-2" disabled={i === 0} onClick={() => moveSection(i, -1)} aria-label="Move section up">
                  <ArrowUp size={15} />
                </Button>
                <Button variant="ghost" className="px-2" disabled={i === f.sections.length - 1} onClick={() => moveSection(i, 1)} aria-label="Move section down">
                  <ArrowDown size={15} />
                </Button>
                <Button variant="danger" className="px-2" onClick={() => setF({ ...f, sections: f.sections.filter((_, k) => k !== i) })} aria-label="Remove section">
                  <Trash2 size={15} />
                </Button>
              </>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Small label">
                <input value={s.label} maxLength={60} onChange={(e) => section(i, { label: e.target.value })} className={INPUT} />
              </Field>
              <Field label="Heading" hint="Put words in [square brackets] to show them in the highlight colour.">
                <input value={s.title} maxLength={160} onChange={(e) => section(i, { title: e.target.value })} className={INPUT} />
              </Field>
              <Field label="Text" hint="Leave a blank line between paragraphs." className="md:col-span-2">
                <textarea rows={4} value={s.body} onChange={(e) => section(i, { body: e.target.value })} className={INPUT} />
              </Field>
              <Field label="Bullet list" hint="One point per line.">
                <textarea rows={4} value={s.list} onChange={(e) => section(i, { list: e.target.value })} className={INPUT} />
              </Field>
              <div className="space-y-4">
                <Picture value={s.image} onPick={(image) => section(i, { image })} onClear={() => section(i, { image: "" })} hint="Shown beside the text, about 560 × 460 px: upload 1120 × 920 px or larger." />
                <Field label="Button text (optional)" hint="Opens the demo booking.">
                  <input value={s.button} maxLength={60} onChange={(e) => section(i, { button: e.target.value })} className={INPUT} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Cards cards={s.cards} onChange={(cards) => section(i, { cards })} />
                <label className="mt-3 flex items-center gap-2 text-[13px] text-[#404348]">
                  <input type="checkbox" checked={s.steps} onChange={(e) => section(i, { steps: e.target.checked })} className="h-4 w-4 accent-[#0047FF]" />
                  Show the cards as numbered steps (on a dark band)
                </label>
                <label className="mt-2 flex items-center gap-2 text-[13px] text-[#404348]">
                  <input type="checkbox" checked={s.dark} onChange={(e) => section(i, { dark: e.target.checked })} className="h-4 w-4 accent-[#0047FF]" />
                  Show this section on a dark band
                </label>
              </div>
              <Field label="Numbered tiles" hint="Short items such as use cases, one per line." className="md:col-span-2">
                <textarea rows={2} value={s.numbered} onChange={(e) => section(i, { numbered: e.target.value })} className={INPUT} />
              </Field>
              <div className="md:col-span-2">
                <Rows
                  label="Questions and answers"
                  rows={s.faqs}
                  blank={{ q: "", a: "" }}
                  max={40}
                  add="Add a question"
                  onChange={(faqs) => section(i, { faqs })}
                  render={(r, set) => (
                    <>
                      <input placeholder="Question" value={r.q} maxLength={300} onChange={(e) => set({ q: e.target.value })} className={INPUT} aria-label="Question" />
                      <textarea placeholder="Answer" rows={2} value={r.a} maxLength={2000} onChange={(e) => set({ a: e.target.value })} className={INPUT} aria-label="Answer" />
                    </>
                  )}
                />
              </div>
              {!s.image && (
                <div className="md:col-span-2">
                  <TileRows rows={s.tiles} onChange={(tiles) => section(i, { tiles })} />
                </div>
              )}
            </div>
          </Card>
        ))}
        <Button variant="ghost" className="w-full" disabled={f.sections.length >= 20} onClick={() => setF({ ...f, sections: [...f.sections, { ...BLANK_SECTION, cards: [] }] })}>
          <Plus size={15} /> Add a section
        </Button>

        <Card title="Closing call to action">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Heading">
              <input value={f.cta.title} maxLength={160} onChange={(e) => setF({ ...f, cta: { ...f.cta, title: e.target.value } })} className={INPUT} />
            </Field>
            <Field label="Button text" hint="Opens the demo booking.">
              <input value={f.cta.button} maxLength={60} onChange={(e) => setF({ ...f, cta: { ...f.cta, button: e.target.value } })} className={INPUT} />
            </Field>
            <Field label="Text" className="md:col-span-2">
              <textarea rows={2} value={f.cta.body} onChange={(e) => setF({ ...f, cta: { ...f.cta, body: e.target.value } })} className={INPUT} />
            </Field>
          </div>
          <label className="mt-4 flex items-center gap-2 text-[13px] text-[#404348]">
            <input type="checkbox" checked={f.related} onChange={(e) => setF({ ...f, related: e.target.checked })} className="h-4 w-4 accent-[#0047FF]" />
            Also show our customers' logos and the product cards at the bottom
          </label>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5EAF4] bg-white p-4">
          <div>{f.id && <Button variant="danger" onClick={remove}>Delete page</Button>}</div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" disabled={busy} onClick={() => save(false)}>
              {f.published ? "Unpublish (save as draft)" : "Save draft"}
            </Button>
            <Button disabled={busy} onClick={() => save(true)}>
              {busy ? "Saving..." : f.published ? "Save and keep live" : "Publish"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

const SKETCH = {
  hero: "h-5 bg-[#0A0626]",
  text: "h-3 bg-[#DCE2EE]",
  split: "h-4 bg-[linear-gradient(90deg,#DCE2EE_55%,#99B5FF_55%)]",
  cards: "h-4 bg-[repeating-linear-gradient(90deg,#C9D6F5_0_24%,transparent_24%_26%)]",
  steps: "h-3 bg-[#3D2BD6]",
  dark: "h-3 bg-[#0A0626]",
  list: "h-3 bg-[#D9F3FF]",
  faq: "h-3 bg-[#F0F4FB]",
  logos: "h-2 bg-[#E5EAF4]",
  cta: "h-3 bg-primary",
};
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Asked whenever a new page is started: what should it look like? A ready layout, a copy of a page the site
// already has, or a copy of a page built here. `name` comes from the navigation link, when there is one.
export function PagePicker({ name: givenName = "", pages = [], onPick, onClose }) {
  const [name, setName] = useState(givenName);
  const [copyOf, setCopyOf] = useState("");
  const [busy, setBusy] = useState(false);
  const title = name.trim();
  const built = COPY_GROUPS.flatMap((g) => g.pages.map((p) => ({ ...p, base: g.base })));
  const start = (content, base) => onPick(fromRow({ id: null, path: `${base || "/"}${slug(title)}`, title: `${title.replace(/[[\]]/g, "")} | Cube Software`, description: "", published: false, content }));
  const needName = () => {
    if (title) return false;
    toast.error("First give the page a name.");
    return true;
  };
  const pickLayout = (l) => needName() || start(l.content(title), l.base);
  const pickCopy = async () => {
    if (needName() || !copyOf) return;
    const mine = pages.find((p) => p.path === copyOf);
    if (mine) return start({ ...mine.content, hero: { ...mine.content.hero, title } }, mine.path.replace(/[^/]*$/, ""));
    setBusy(true);
    const source = built.find((p) => p.path === copyOf);
    const r = await act(() => copyPage(source));
    setBusy(false);
    if (!r) return;
    if (r.skipped) toast.info(`${r.skipped} one-off part${r.skipped > 1 ? "s" : ""} of that page, specially designed for it, couldn't be copied. Everything else is here.`);
    start({ ...r.content, hero: { ...r.content.hero, title } }, source.base);
  };
  return (
    <div data-cube-ui="" className="fixed inset-0 z-[10000] overflow-y-auto bg-[#0A0626]/60 p-4" role="dialog" aria-modal="true" aria-label="New page">
      <div className="mx-auto my-6 max-w-[920px] rounded-3xl bg-white p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[24px] font-medium text-[#0A0626]">What should the new page look like?</h2>
            <p className="mt-1 text-[14px] text-[#6B6E75]">Whichever you choose, you can change every word, picture and section next. Nothing goes live until you publish it.</p>
          </div>
          <Button variant="ghost" className="px-2" onClick={onClose} aria-label="Close">
            <X size={16} />
          </Button>
        </div>
        <Field label="Page name" className="mt-5">
          <input value={name} maxLength={120} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cloud Fax" className={INPUT} />
        </Field>

        <h3 className="mt-7 flex items-center gap-2 text-[15px] font-medium text-[#0A0626]">
          <Copy size={16} className="text-primary" /> Make it look like a page you already have
        </h3>
        <p className="mt-1 text-[13px] text-[#6B6E75]">You get a separate copy with that page's words, pictures and cards, including your site edits. The original isn't touched.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select value={copyOf} onChange={(e) => setCopyOf(e.target.value)} className={`${INPUT} min-w-[240px] flex-1`} aria-label="Page to copy">
            <option value="">Choose a page...</option>
            {pages.length > 0 && (
              <optgroup label="Pages you built">
                {pages.map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.content.hero.title.replace(/[[\]]/g, "")}
                  </option>
                ))}
              </optgroup>
            )}
            {COPY_GROUPS.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.pages.map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {copyOf && (
            <a href={copyOf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE2EE] bg-white px-3 py-2 text-[14px] font-medium text-[#0A0626] hover:bg-[#F0F4FB]">
              See it <ExternalLink size={13} />
            </a>
          )}
          <Button disabled={!copyOf || busy} onClick={pickCopy}>
            {busy ? "Copying..." : "Use this page"}
          </Button>
        </div>

        <h3 className="mt-7 flex items-center gap-2 text-[15px] font-medium text-[#0A0626]">
          <LayoutTemplate size={16} className="text-primary" /> Or create a whole new page
        </h3>
        <p className="mt-1 text-[13px] text-[#6B6E75]">A ready layout with sample text marked {SAMPLE} for you to replace, or a blank page.</p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LAYOUTS.map((l) => (
            <li key={l.key}>
              <button type="button" onClick={() => pickLayout(l)} className="group flex h-full w-full flex-col rounded-2xl border border-[#E5EAF4] p-4 text-left transition-colors hover:border-primary">
                <span aria-hidden="true" className="flex w-full flex-col gap-1 rounded-lg border border-[#EEF1F7] p-2">
                  {l.sketch.map((k, i) => (
                    <span key={i} className={`block w-full rounded-sm ${SKETCH[k]}`} />
                  ))}
                </span>
                <span className="mt-3 block text-[15px] font-medium text-[#0A0626] group-hover:text-primary">{l.name}</span>
                <span className="mt-1 block text-[13px] leading-5 text-[#6B6E75]">{l.desc}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// --- Every page of the website, with its switch and its edit buttons ---------------------------------------------
const SITE_PAGES = Object.entries(ROUTES)
  .filter(([, m]) => !m.canonical)
  .map(([path, m]) => ({ path, name: m.title.split("|")[0].trim() }));
const PAGE_GROUPS = [
  ["Main pages", (p) => !/^\/(services|billing|industries|prison-calling|student-calling|terms|privacy)/.test(p)],
  ["Products and services", (p) => /^\/(services|billing|prison-calling|student-calling)/.test(p)],
  ["Industries", (p) => p.startsWith("/industries/")],
  ["Legal", (p) => /^\/(terms|privacy)/.test(p)],
];

function PageRow({ name, path, status, on, canEdit, onToggle, onBuild }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 text-[14px]">
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <Toggle on={on} label={`${name} page`} onChange={onToggle} />
        <span className="min-w-[180px]">
          <span className={`block font-medium ${on ? "text-[#0A0626]" : "text-[#9CA3AF] line-through"}`}>{name}</span>
          <span className="block text-[12px] text-[#6B6E75]">
            <span className="font-mono">{path}</span>
            {!on && <span className="ml-1.5 text-[#9A5B00]">· Off: visitors see the “back soon” message</span>}
            {status}
          </span>
        </span>
      </span>
      <span className="flex flex-wrap gap-2">
        {onBuild && (
          <Button variant="ghost" onClick={onBuild}>
            Edit sections
          </Button>
        )}
        {canEdit && (
          <Button onClick={() => startEditing(path)}>
            <PencilLine size={15} /> Edit
          </Button>
        )}
        <a href={path} target="_blank" rel="noopener noreferrer" aria-label={`View ${name}`} className="inline-flex items-center rounded-lg border border-[#DCE2EE] bg-white px-2.5 py-2 text-[#0A0626] hover:bg-[#F0F4FB]">
          <ExternalLink size={15} />
        </a>
      </span>
    </li>
  );
}

export default function PagesAdmin({ me, out }) {
  const [data, reload] = useResource("/admin/pages", out);
  const [settings] = useResource("/admin/settings", out);
  const [off, setOff] = useState(null);
  const [editing, setEditing] = useState(null);
  const [picking, setPicking] = useState(false);
  const [search, setSearch] = useState("");
  const canEdit = me.isOwner || me.permissions.includes("content");
  useEffect(() => {
    if (settings) setOff({ paths: [], title: "", message: "", ...(settings.pagesOff || {}) });
  }, [settings]);

  if (editing) return <Editor key={editing.id || "new"} initial={editing} onDone={() => (setEditing(null), reload())} />;
  if (!off) return <Empty>Loading...</Empty>;

  const store = (next, message) => act(() => api("/admin/settings/pagesOff", { method: "PUT", body: { value: next } }), message);
  const toggle = async (path, name, on) => {
    if (!on && path === "/" && !window.confirm("Switch off the homepage? Visitors arriving at your main address will only see the “back soon” message.")) return;
    const next = { ...off, paths: on ? off.paths.filter((p) => p !== path) : [...off.paths, path] };
    setOff(next);
    if (!(await store(next, on ? `${name} is live again` : `${name} is switched off`))) setOff(off);
  };
  const match = (p) => !search.trim() || `${p.name} ${p.path}`.toLowerCase().includes(search.trim().toLowerCase());
  const built = (data?.pages || []).map((p) => ({ ...p, name: p.content.hero.title.replace(/[[\]]/g, "") })).filter(match);
  const offCount = off.paths.length;

  return (
    <>
      <PageTitle
        title="Pages"
        desc={`Every page of the website. Switch a page off to take it away from visitors, or press Edit to change anything on it. ${offCount ? `${offCount} switched off right now.` : "All pages are on."}`}
        actions={<Button onClick={() => setPicking(true)}><Plus size={16} /> New page</Button>}
      />
      {picking && <PagePicker pages={data?.pages || []} onClose={() => setPicking(false)} onPick={(f) => (setPicking(false), setEditing(f))} />}

      <div className="mb-4">
        <input type="search" placeholder="Find a page..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${INPUT} max-w-md`} aria-label="Find a page" />
      </div>

      <div className="space-y-4">
        {built.length > 0 && (
          <Card title={`Pages you built (${built.length})`}>
            <ul className="-my-3 divide-y divide-[#EEF1F7]">
              {built.map((p) => (
                <PageRow
                  key={p.id}
                  name={p.name}
                  path={p.path}
                  on={!off.paths.includes(p.path)}
                  canEdit={canEdit}
                  status={<span className="ml-1.5">· {p.published ? <span className="text-[#0F6B3A]">Published</span> : <span className="text-[#9A5B00]">Draft</span>} · updated {utcStamp(p.updated_at)}</span>}
                  onToggle={(on) => toggle(p.path, p.name, on)}
                  onBuild={() => setEditing(fromRow(p))}
                />
              ))}
            </ul>
          </Card>
        )}
        {PAGE_GROUPS.map(([title, inGroup]) => {
          const rows = SITE_PAGES.filter((p) => inGroup(p.path) && match(p));
          if (!rows.length) return null;
          return (
            <Card key={title} title={`${title} (${rows.length})`}>
              <ul className="-my-3 divide-y divide-[#EEF1F7]">
                {rows.map((p) => (
                  <PageRow key={p.path} name={p.name} path={p.path} on={!off.paths.includes(p.path)} canEdit={canEdit} onToggle={(on) => toggle(p.path, p.name, on)} />
                ))}
              </ul>
            </Card>
          );
        })}

        <Card title="What visitors see on a switched-off page" actions={<Button onClick={() => store(off, "Message saved")}>Save message</Button>}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Headline">
              <input value={off.title} placeholder={DEFAULT_OFF.title} maxLength={120} onChange={(e) => setOff({ ...off, title: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Message">
              <input value={off.message} placeholder={DEFAULT_OFF.message} maxLength={300} onChange={(e) => setOff({ ...off, message: e.target.value })} className={INPUT} />
            </Field>
          </div>
          <p className="mt-3 text-[12px] text-[#6B6E75]">It appears beside the Cube animation with its revolving app logos, with buttons back to the homepage and to Contact. You can still press Edit on a page while it's off: only visitors are kept out.</p>
        </Card>
      </div>
    </>
  );
}
