import React, { useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, ImagePlus, Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { ICONS } from "../lib/editable";
import { Button, Card, Empty, Field, INPUT, PageTitle, act, useResource, utcStamp } from "./ui";
import { MediaPicker } from "./MediaAdmin";

// Build new pages for the website without code. A page has a top section (hero), any number of sections
// and a closing call to action, and is drawn with the same layout as the site's own product pages: the
// layout of each section follows from what it holds (text, a list, cards, numbered steps, a picture).

const toParas = (s) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const toLines = (s) => s.split("\n").map((p) => p.trim()).filter(Boolean);
const BLANK_CARD = { icon: "", title: "", desc: "" };
const BLANK_SECTION = { label: "", title: "", body: "", list: "", image: "", button: "", steps: false, cards: [] };
const BLANK_PAGE = {
  id: null,
  path: "/services/",
  title: "",
  description: "",
  published: false,
  hero: { label: "", title: "", body: "", list: "", image: "", button: "Book a demo" },
  sections: [{ ...BLANK_SECTION }],
  cta: { title: "", body: "", button: "Book a Free Demo" },
  related: true,
};

// Database row -> editor fields (paragraphs and lists as plain text boxes).
function fromRow(p) {
  const c = p.content;
  const text = (s) => ({ ...s, body: (s.body || []).join("\n\n"), list: (s.list || []).join("\n") });
  return {
    id: p.id,
    path: p.path,
    title: p.title,
    description: p.description,
    published: p.published,
    hero: text(c.hero),
    sections: c.sections.map((s) => ({ ...text(s), cards: s.cards || [] })),
    cta: c.cta ? { ...c.cta, body: (c.cta.body || []).join("\n\n") } : { title: "", body: "", button: "" },
    related: c.related,
  };
}

// Editor fields -> what the server stores. Empty optional parts are left out.
function toBody(f, published = f.published) {
  const para = (s) => ({ ...s, body: toParas(s.body), list: toLines(s.list) });
  return {
    path: f.path.trim(),
    title: f.title.trim(),
    description: f.description.trim(),
    published,
    content: {
      hero: { ...para(f.hero), body: toParas(f.hero.body).slice(0, 4) },
      sections: f.sections.map((s) => ({ ...para(s), cards: s.cards.filter((c) => c.title.trim()) })),
      cta: f.cta.title.trim() || f.cta.body.trim() ? { ...f.cta, body: toParas(f.cta.body).slice(0, 3) } : null,
      related: f.related,
    },
  };
}

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
          const Icon = ICONS.get(c.icon);
          return (
            <li key={i} className="grid gap-2 rounded-xl border border-[#E5EAF4] p-3 md:grid-cols-[170px_1fr_auto]">
              <span className="flex items-start gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">{Icon && <Icon size={16} />}</span>
                <select value={c.icon} onChange={(e) => set(i, { icon: e.target.value })} className={INPUT} aria-label="Icon">
                  <option value="">No icon</option>
                  {[...ICONS.keys()].sort().map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </span>
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

function Editor({ initial, onDone }) {
  const [f, setF] = useState(initial);
  const [busy, setBusy] = useState(false);
  const hero = (patch) => setF({ ...f, hero: { ...f.hero, ...patch } });
  const section = (i, patch) => setF({ ...f, sections: f.sections.map((s, k) => (k === i ? { ...s, ...patch } : s)) });
  const moveSection = (i, d) => {
    const next = [...f.sections];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setF({ ...f, sections: next });
  };

  const save = async (published) => {
    setBusy(true);
    const body = toBody(f, published);
    const r = await act(
      () => (f.id ? api(`/admin/pages/${f.id}`, { method: "PUT", body }) : api("/admin/pages", { method: "POST", body })),
      published ? `Published. It's live at ${body.path}` : "Saved as a draft. Only signed-in admins can see it."
    );
    setBusy(false);
    if (!r) return;
    const id = f.id || r.id;
    setF({ ...f, id, published });
  };
  const remove = async () =>
    window.confirm(`Delete the page ${f.path}? Visitors going there will be sent to the homepage.`) && (await act(() => api(`/admin/pages/${f.id}`, { method: "DELETE" }), "Page deleted")) && onDone();

  return (
    <>
      <PageTitle
        title={f.id ? `Edit ${f.path}` : "New page"}
        desc="Fill in what you need; empty boxes are simply left out. Each section's layout follows from what it holds: text, a list, cards, numbered steps or a picture."
        actions={
          <>
            <Button variant="ghost" onClick={onDone}>
              Back to pages
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
            <Field label="Headline (required)">
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
              <Picture value={f.hero.image} onPick={(image) => hero({ image })} onClear={() => hero({ image: "" })} hint="Shown on the right, about 560 × 380 px: upload 1120 × 760 px or larger. Without one, the Cube animation shows." />
            </div>
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
              <Field label="Heading">
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
              </div>
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

export default function PagesAdmin({ out }) {
  const [data, reload] = useResource("/admin/pages", out);
  const [editing, setEditing] = useState(null);
  if (editing) return <Editor key={editing.id || "new"} initial={editing} onDone={() => (setEditing(null), reload())} />;
  return (
    <>
      <PageTitle
        title="Pages"
        desc="New pages for the website, built here without code. Link to them from any card (Site content → Edit the website → Edit these cards)."
        actions={<Button onClick={() => setEditing({ ...BLANK_PAGE, sections: [{ ...BLANK_SECTION, cards: [] }] })}><Plus size={16} /> New page</Button>}
      />
      <Card>
        {!data ? (
          <Empty>Loading...</Empty>
        ) : data.pages.length === 0 ? (
          <Empty>No pages yet. Click “New page” to build one.</Empty>
        ) : (
          <ul className="-my-3 divide-y divide-[#EEF1F7]">
            {data.pages.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[14px]">
                <span className="min-w-0">
                  <span className="block font-medium text-[#0A0626]">{p.content.hero.title}</span>
                  <span className="block text-[12px] text-[#6B6E75]">
                    <span className="font-mono">{p.path}</span> · {p.published ? <span className="text-[#0F6B3A]">Live</span> : <span className="text-[#9A5B00]">Draft</span>} · updated {utcStamp(p.updated_at)}
                  </span>
                </span>
                <span className="flex gap-2">
                  <a href={p.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE2EE] bg-white px-3 py-2 text-[13px] font-medium text-[#0A0626] hover:bg-[#F0F4FB]">
                    {p.published ? "View" : "Preview"} <ExternalLink size={13} />
                  </a>
                  <Button onClick={() => setEditing(fromRow(p))}>Edit</Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
