import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ExternalLink, FilePlus2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { DEFAULT_NAV, navIcon } from "../lib/nav";
import ROUTES from "../seo/routes.json";
import { Button, Card, Empty, Field, INPUT, PageTitle, act, useResource } from "./ui";
import { Editor, IconSelect, PagePicker } from "./PagesAdmin";

// The bar at the top of the website: its links and dropdown menus, each menu's side options and their links.
// A link can open any page, and a new page can be started from here. Saving puts the menu live straight away.
// Site edits work on words as shown on the website, so they aren't touched by anything here.

const LAYOUTS = [
  ["rich", "Big", "Side options, a highlight box and links with short descriptions (like Platform)."],
  ["simple", "Simple", "Side options and links with short descriptions (like Solutions)."],
  ["columns", "Columns", "Links in columns with small headings (like Resources)."],
];
const NEW_LINK = { label: "", desc: "", href: "", icon: "Link2" };
const NEW_OPTION = { label: "", icon: "Layers", featured: null, links: [] };
const CREATE = "__create";
const OTHER = "__other";
const SECTIONS_ON_HOME = [["/#features", "Homepage: Features"], ["/#faq", "Homepage: FAQ"]];
const SITE_PAGES = Object.entries(ROUTES)
  .filter(([, m]) => !m.canonical && !m.noindex)
  .map(([path, m]) => [path, m.title.split("|")[0].trim()])
  .sort((a, b) => a[1].localeCompare(b[1]));

const swap = (list, i, j) => {
  [list[i], list[j]] = [list[j], list[i]];
};

function Arrows({ i, count, onMove, back = ArrowUp, forward = ArrowDown, what }) {
  const Back = back;
  const Forward = forward;
  return (
    <>
      <Button variant="ghost" className="px-2" disabled={i === 0} onClick={() => onMove(i - 1)} aria-label={`Move ${what} earlier`}>
        <Back size={14} />
      </Button>
      <Button variant="ghost" className="px-2" disabled={i === count - 1} onClick={() => onMove(i + 1)} aria-label={`Move ${what} later`}>
        <Forward size={14} />
      </Button>
    </>
  );
}

// Which page a link opens: any page on the site, a page built here, another address, or a new page.
function Destination({ value, onChange, onCreate, pages, canCreate }) {
  const known = [...pages.map((p) => p.path), ...SITE_PAGES.map(([p]) => p), ...SECTIONS_ON_HOME.map(([p]) => p)].includes(value);
  const [other, setOther] = useState(false);
  const typing = other || (value && !known);
  const mine = pages.find((p) => p.path === value);
  return (
    <div className="min-w-0">
      <select
        value={typing ? OTHER : value}
        aria-label="Opens"
        onChange={(e) => {
          const v = e.target.value;
          if (v === CREATE) return onCreate();
          setOther(v === OTHER);
          if (v !== OTHER) onChange(v);
        }}
        className={INPUT}
      >
        <option value="">Choose what it opens...</option>
        {canCreate && <option value={CREATE}>＋ Create a new page...</option>}
        {pages.length > 0 && (
          <optgroup label="Pages you built">
            {pages.map((p) => (
              <option key={p.path} value={p.path}>
                {p.content.hero.title.replace(/[[\]]/g, "")}
                {p.published ? "" : " (draft)"}
              </option>
            ))}
          </optgroup>
        )}
        <optgroup label="Website pages">
          {SITE_PAGES.map(([path, name]) => (
            <option key={path} value={path}>
              {name}
            </option>
          ))}
          {SECTIONS_ON_HOME.map(([path, name]) => (
            <option key={path} value={path}>
              {name}
            </option>
          ))}
        </optgroup>
        <option value={OTHER}>Another address or web link...</option>
      </select>
      {typing && <input value={value} maxLength={300} onChange={(e) => onChange(e.target.value.trim())} placeholder="/your-page or https://..." className={`${INPUT} mt-2 font-mono`} aria-label="Address or web link" />}
      {mine && !mine.published && <span className="mt-1 block text-[12px] text-[#9A5B00]">This page is still a draft: visitors go to the homepage until you publish it in Pages.</span>}
    </div>
  );
}

// A site edit changes words wherever they appear, so the website can show something else than the box below it.
function Shown({ text, edits }) {
  const shown = edits.get((text || "").replace(/\s+/g, " ").trim());
  return shown ? <span className="mt-1 block text-[12px] text-[#0F6B3A]">Your site edit shows this as “{shown.length > 70 ? `${shown.slice(0, 70)}...` : shown}”</span> : null;
}

export default function NavAdmin({ me, out }) {
  const canPages = me.isOwner || me.permissions.includes("pages");
  const [data] = useResource("/admin/settings", out);
  const [built, reloadPages] = useResource(canPages ? "/admin/pages" : null, out);
  const [nav, setNav] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sel, setSel] = useState(0);
  const [openOption, setOpenOption] = useState(0);
  const [edits, setEdits] = useState(new Map());
  const [asking, setAsking] = useState(null); // { name, link } while choosing what a new page looks like
  const [drafting, setDrafting] = useState(null); // { form, link } while building it
  const pages = built?.pages || [];

  useEffect(() => {
    if (data) setNav(structuredClone(data.nav || DEFAULT_NAV));
  }, [data]);
  useEffect(() => {
    api("/content")
      .then(({ overrides }) => setEdits(new Map(overrides.filter((o) => o.kind === "text" && o.scope === "*").map((o) => [o.original, o.replacement]))))
      .catch(() => {});
  }, []);
  // Don't lose unsaved work to a closed tab.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!nav) return <Empty>Loading...</Empty>;

  const edit = (fn) => {
    setNav((n) => {
      const next = structuredClone(n);
      fn(next);
      return next;
    });
    setDirty(true);
  };
  const save = async () => {
    setBusy(true);
    const ok = await act(() => api("/admin/settings/nav", { method: "PUT", body: { value: nav } }), "Saved. The navigation bar is live on the website.");
    setBusy(false);
    if (ok) setDirty(false);
  };

  if (drafting) {
    return (
      <Editor
        initial={drafting.form}
        backLabel="Back to the navigation bar"
        onDone={(path) => {
          if (path) {
            drafting.link(path);
            toast.success("Page linked. Press Save to put it in the navigation bar.");
          }
          setDrafting(null);
          reloadPages();
        }}
      />
    );
  }

  const item = nav.items[Math.min(sel, nav.items.length - 1)];
  const at = Math.min(sel, nav.items.length - 1);
  const destination = (value, name, set) => (
    <Destination value={value} pages={pages} canCreate={canPages} onChange={set} onCreate={() => setAsking({ name: name || "", link: set })} />
  );

  return (
    <>
      <PageTitle
        title="Navigation bar"
        desc="Add, rename, move or remove anything in the bar at the top of the website, on desktop and phones. Your site edits stay exactly as they are."
        actions={
          <>
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE2EE] bg-white px-3.5 py-2 text-[14px] font-medium text-[#0A0626] hover:bg-[#F0F4FB]">
              View website <ExternalLink size={14} />
            </a>
            <Button disabled={busy || !dirty} onClick={save}>
              {busy ? "Saving..." : dirty ? "Save" : "Saved"}
            </Button>
          </>
        }
      />

      {/* The bar itself: pick an item to change it below. */}
      <div className="rounded-2xl border border-[#E5EAF4] bg-white p-3">
        <div className="flex flex-wrap items-center gap-1">
          {nav.items.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => (setSel(i), setOpenOption(0))}
              aria-pressed={i === at}
              className={`inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-[15px] transition-colors ${i === at ? "bg-primary text-white" : "text-[#0A0626] hover:bg-[#F0F4FB]"}`}
            >
              {m.label || "(no name)"}
              {m.groups && <ChevronDown size={15} />}
            </button>
          ))}
          <Button
            variant="ghost"
            className="ml-1"
            disabled={nav.items.length >= 8}
            onClick={() => {
              edit((n) => n.items.push({ label: "", href: "" }));
              setSel(nav.items.length);
            }}
          >
            <Plus size={15} /> Add to the bar
          </Button>
        </div>
      </div>

      <Card
        className="mt-4"
        title={item.label || "New item"}
        actions={
          <>
            <Arrows
              i={at}
              count={nav.items.length}
              back={ArrowLeft}
              forward={ArrowRight}
              what="this item"
              onMove={(to) => {
                edit((n) => swap(n.items, at, to));
                setSel(to);
              }}
            />
            <Button
              variant="danger"
              className="px-2"
              disabled={nav.items.length === 1}
              aria-label={`Remove ${item.label || "this item"} from the bar`}
              onClick={() => {
                if (!window.confirm(`Remove “${item.label || "this item"}” from the navigation bar? Its pages stay on the website.`)) return;
                edit((n) => n.items.splice(at, 1));
                setSel(0);
              }}
            >
              <Trash2 size={15} />
            </Button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name in the bar">
            <input value={item.label} maxLength={40} onChange={(e) => edit((n) => (n.items[at].label = e.target.value))} className={INPUT} />
            <Shown text={item.label} edits={edits} />
          </Field>
          <Field label="What it does">
            <select
              value={item.groups ? "menu" : "link"}
              onChange={(e) => {
                if (e.target.value === "link" && !window.confirm(`This removes the options and links inside “${item.label}” from the bar. Continue?`)) return;
                edit((n) => {
                  n.items[at] = e.target.value === "link" ? { label: item.label, href: "" } : { label: item.label, layout: "simple", extras: false, groups: [{ ...NEW_OPTION, label: item.label, links: [] }] };
                });
                setOpenOption(0);
              }}
              className={INPUT}
            >
              <option value="link">Opens a page</option>
              <option value="menu">Opens a dropdown menu</option>
            </select>
          </Field>
          {!item.groups && (
            <div className="md:col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium text-[#404348]">Opens</span>
              {destination(item.href, item.label, (href) => edit((n) => (n.items[at].href = href)))}
            </div>
          )}
        </div>

        {item.groups && (
          <>
            <span className="mb-2 mt-6 block text-[13px] font-medium text-[#404348]">Look of the dropdown</span>
            <div className="grid gap-2 md:grid-cols-3">
              {LAYOUTS.map(([key, name, desc]) => (
                <label key={key} className={`flex cursor-pointer gap-2 rounded-xl border p-3 text-[13px] ${item.layout === key ? "border-primary bg-[#F5F8FF]" : "border-[#E5EAF4]"}`}>
                  <input type="radio" name="nav-layout" checked={item.layout === key} onChange={() => edit((n) => (n.items[at].layout = key))} className="mt-0.5 h-4 w-4 accent-[#0047FF]" />
                  <span>
                    <span className="block font-medium text-[#0A0626]">{name}</span>
                    <span className="text-[#6B6E75]">{desc}</span>
                  </span>
                </label>
              ))}
            </div>
            {item.layout === "columns" && (
              <label className="mt-3 flex items-center gap-2 text-[13px] text-[#404348]">
                <input type="checkbox" checked={item.extras} onChange={(e) => edit((n) => (n.items[at].extras = e.target.checked))} className="h-4 w-4 accent-[#0047FF]" />
                Also show the boxes for sales and support contact, pricing, CRM integration and going live
              </label>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[13px] font-medium text-[#404348]">{item.layout === "columns" ? "Columns" : "Side options"} ({item.groups.length})</span>
              <Button
                variant="ghost"
                disabled={item.groups.length >= 12}
                onClick={() => {
                  edit((n) => n.items[at].groups.push({ ...NEW_OPTION, links: [] }));
                  setOpenOption(item.groups.length);
                }}
              >
                <Plus size={15} /> Add {item.layout === "columns" ? "a column" : "an option"}
              </Button>
            </div>

            <ul className="mt-2 space-y-2">
              {item.groups.map((g, k) => {
                const Icon = navIcon(g.icon);
                const isOpen = openOption === k;
                const others = nav.items.map((m, i) => [m, i]).filter(([m, i]) => m.groups && i !== at);
                return (
                  <li key={k} className="rounded-xl border border-[#E5EAF4]">
                    <div className="flex flex-wrap items-center gap-2 p-2.5">
                      <button type="button" onClick={() => setOpenOption(isOpen ? -1 : k)} aria-expanded={isOpen} className="flex min-w-[180px] flex-1 items-center gap-2 text-left text-[14px] font-medium text-[#0A0626]">
                        <ChevronDown size={16} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        {item.layout !== "columns" && <Icon size={16} className="shrink-0 text-primary" />}
                        {g.label || "(no name)"}
                        <span className="font-normal text-[#6B6E75]">· {g.links.length} links</span>
                      </button>
                      {others.length > 0 && (
                        <select
                          value=""
                          aria-label={`Move ${g.label} to another menu`}
                          onChange={(e) => {
                            const to = Number(e.target.value);
                            if (item.groups.length === 1) return toast.error(`“${item.label}” needs at least one option. Add another first, or remove “${item.label}” from the bar.`);
                            edit((n) => n.items[to].groups.push(n.items[at].groups.splice(k, 1)[0]));
                            setOpenOption(0);
                            toast.success(`Moved to ${nav.items[to].label}. Press Save to put it live.`);
                          }}
                          className={`${INPUT} w-auto py-1.5 text-[13px]`}
                        >
                          <option value="">Move to...</option>
                          {others.map(([m, i]) => (
                            <option key={i} value={i}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      )}
                      <Arrows
                        i={k}
                        count={item.groups.length}
                        what={g.label}
                        onMove={(to) => {
                          edit((n) => swap(n.items[at].groups, k, to));
                          setOpenOption(to);
                        }}
                      />
                      <Button
                        variant="danger"
                        className="px-2"
                        disabled={item.groups.length === 1}
                        aria-label={`Remove ${g.label}`}
                        onClick={() => {
                          if (window.confirm(`Remove “${g.label || "this option"}” and its ${g.links.length} links from the bar? The pages stay on the website.`)) edit((n) => n.items[at].groups.splice(k, 1));
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>

                    {isOpen && (
                      <div className="border-t border-[#EEF1F7] p-3">
                        <div className={`grid gap-3 ${item.layout === "columns" ? "" : "md:grid-cols-2"}`}>
                          <Field label={item.layout === "columns" ? "Column heading" : "Option name"}>
                            <input value={g.label} maxLength={60} onChange={(e) => edit((n) => (n.items[at].groups[k].label = e.target.value))} className={INPUT} />
                            <Shown text={g.label} edits={edits} />
                          </Field>
                          {item.layout !== "columns" && (
                            <div>
                              <span className="mb-1.5 block text-[13px] font-medium text-[#404348]">Icon</span>
                              <IconSelect value={g.icon} onChange={(icon) => edit((n) => (n.items[at].groups[k].icon = icon))} />
                            </div>
                          )}
                        </div>

                        {item.layout === "rich" && (
                          <div className="mt-3 rounded-xl bg-[#F5F8FD] p-3">
                            <label className="flex items-center gap-2 text-[13px] font-medium text-[#404348]">
                              <input
                                type="checkbox"
                                checked={Boolean(g.featured)}
                                onChange={(e) => edit((n) => (n.items[at].groups[k].featured = e.target.checked ? { title: "", desc: "", href: "" } : null))}
                                className="h-4 w-4 accent-[#0047FF]"
                              />
                              Highlight box above the links
                            </label>
                            {g.featured && (
                              <div className="mt-3 grid gap-3 md:grid-cols-2">
                                <Field label="Title">
                                  <input value={g.featured.title} maxLength={120} onChange={(e) => edit((n) => (n.items[at].groups[k].featured.title = e.target.value))} className={INPUT} />
                                  <Shown text={g.featured.title} edits={edits} />
                                </Field>
                                <div>
                                  <span className="mb-1.5 block text-[13px] font-medium text-[#404348]">“Learn more” opens</span>
                                  {destination(g.featured.href, g.featured.title, (href) => edit((n) => (n.items[at].groups[k].featured.href = href)))}
                                </div>
                                <Field label="Text" className="md:col-span-2">
                                  <textarea rows={2} value={g.featured.desc} maxLength={500} onChange={(e) => edit((n) => (n.items[at].groups[k].featured.desc = e.target.value))} className={INPUT} />
                                  <Shown text={g.featured.desc} edits={edits} />
                                </Field>
                              </div>
                            )}
                          </div>
                        )}

                        <span className="mb-2 mt-4 block text-[13px] font-medium text-[#404348]">Links</span>
                        <ul className="space-y-2">
                          {g.links.map((l, x) => (
                            <li key={x} className={`grid gap-2 rounded-xl border border-[#EEF1F7] p-2.5 md:grid-cols-[170px_1fr_1fr_auto]`}>
                              <IconSelect value={l.icon} onChange={(icon) => edit((n) => (n.items[at].groups[k].links[x].icon = icon))} />
                              <span className="min-w-0">
                                <input placeholder="Link name" value={l.label} maxLength={60} onChange={(e) => edit((n) => (n.items[at].groups[k].links[x].label = e.target.value))} className={INPUT} aria-label="Link name" />
                                <Shown text={l.label} edits={edits} />
                                {item.layout !== "columns" && (
                                  <>
                                    <input placeholder="Short description" value={l.desc} maxLength={300} onChange={(e) => edit((n) => (n.items[at].groups[k].links[x].desc = e.target.value))} className={`${INPUT} mt-2`} aria-label="Short description" />
                                    <Shown text={l.desc} edits={edits} />
                                  </>
                                )}
                              </span>
                              {destination(l.href, l.label, (href) => edit((n) => (n.items[at].groups[k].links[x].href = href)))}
                              <span className="flex gap-1.5">
                                <Arrows i={x} count={g.links.length} what={l.label} onMove={(to) => edit((n) => swap(n.items[at].groups[k].links, x, to))} />
                                <Button variant="danger" className="px-2" aria-label={`Remove ${l.label}`} onClick={() => edit((n) => n.items[at].groups[k].links.splice(x, 1))}>
                                  <Trash2 size={14} />
                                </Button>
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Button variant="ghost" className="mt-2" disabled={g.links.length >= 40} onClick={() => edit((n) => n.items[at].groups[k].links.push({ ...NEW_LINK }))}>
                          <Plus size={15} /> Add a link
                        </Button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Card>

      <Card title="Buttons on the right of the bar" className="mt-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-[#404348]">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={nav.expert !== false} onChange={(e) => edit((n) => (n.expert = e.target.checked))} className="h-4 w-4 accent-[#0047FF]" />
            Talk to an expert
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={nav.demo !== false} onChange={(e) => edit((n) => (n.demo = e.target.checked))} className="h-4 w-4 accent-[#0047FF]" />
            Book a demo
          </label>
        </div>
      </Card>

      <div className="sticky bottom-3 z-10 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5EAF4] bg-white p-3 shadow-[0_12px_30px_-18px_rgb(10_6_38/0.4)]">
        <Button
          variant="ghost"
          onClick={() => {
            if (!window.confirm("Go back to the original menu? Nothing changes on the website until you press Save.")) return;
            setNav(structuredClone(DEFAULT_NAV));
            setDirty(true);
            setSel(0);
          }}
        >
          <RotateCcw size={15} /> Start again from the original menu
        </Button>
        <span className="flex items-center gap-3">
          <span className={`text-[13px] ${dirty ? "text-[#9A5B00]" : "text-[#0F6B3A]"}`}>{dirty ? "You have unsaved changes" : "Everything is saved"}</span>
          <Button disabled={busy || !dirty} onClick={save}>
            {busy ? "Saving..." : "Save"}
          </Button>
        </span>
      </div>

      {!canPages && (
        <p className="mt-3 flex items-center gap-2 text-[13px] text-[#6B6E75]">
          <FilePlus2 size={14} /> To create new pages from here, ask the owner to give you access to Pages.
        </p>
      )}

      {asking && (
        <PagePicker
          name={asking.name}
          pages={pages}
          onClose={() => setAsking(null)}
          onPick={(form) => {
            setDrafting({ form, link: asking.link });
            setAsking(null);
          }}
        />
      )}
    </>
  );
}
