import React, { useEffect, useState } from "react";
import { ExternalLink, RotateCcw } from "lucide-react";
import { api } from "../lib/api";
import { Button, Card, Empty, PageTitle, act, useResource } from "./ui";
import { startEditing } from "./ContentAdmin";

// Font sizes across the whole website, by kind of text. One piece of text anywhere can be sized on its own in the
// visual editor (click it, then use "Text size"). Every size is a percentage of the site's original design.

export const FONT_KINDS = [
  ["all", "Whole website", "Everything together."],
  ["head", "Headings", "Page and section headlines."],
  ["body", "Body text", "Paragraphs, lists, cards and labels."],
  ["nav", "Menu and buttons", "The navigation bar and every button."],
];
const DEFAULTS = { all: 100, head: 100, body: 100, nav: 100 };

export default function FontsAdmin({ out }) {
  const [data, reload] = useResource("/admin/settings", out);
  const [sizes, setSizes] = useState(null);
  const [saved, setSaved] = useState(null);
  useEffect(() => {
    if (!data) return;
    const s = { ...DEFAULTS, ...(data.fonts || {}) };
    setSizes(s);
    setSaved(JSON.stringify(s));
  }, [data]);
  if (!sizes) return <Empty>Loading...</Empty>;
  const dirty = JSON.stringify(sizes) !== saved;
  const save = async () => (await act(() => api("/admin/settings/fonts", { method: "PUT", body: { value: sizes } }), "Saved. The new sizes are live on the website.")) && reload();

  return (
    <>
      <PageTitle
        title="Font sizes"
        desc="Make text bigger or smaller across the whole website. Your text edits stay as they are; only their size changes."
        actions={
          <>
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE2EE] bg-white px-3.5 py-2 text-[14px] font-medium text-[#0A0626] hover:bg-[#F0F4FB]">
              View website <ExternalLink size={14} />
            </a>
            <Button disabled={!dirty} onClick={save}>
              {dirty ? "Save" : "Saved"}
            </Button>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card
          title="Sizes"
          actions={
            <Button variant="ghost" disabled={Object.keys(DEFAULTS).every((k) => sizes[k] === 100)} onClick={() => setSizes(DEFAULTS)}>
              <RotateCcw size={15} /> Original sizes
            </Button>
          }
        >
          <ul className="space-y-5">
            {FONT_KINDS.map(([key, label, hint]) => (
              <li key={key}>
                <label className="block">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[14px] font-medium text-[#0A0626]">{label}</span>
                    <output className="font-mono text-[13px] text-primary">{sizes[key]}%</output>
                  </span>
                  <span className="block text-[12px] text-[#6B6E75]">{hint}</span>
                  <input type="range" min={70} max={140} step={5} value={sizes[key]} onChange={(e) => setSizes({ ...sizes, [key]: Number(e.target.value) })} className="mt-2 w-full accent-[#0047FF]" />
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl bg-[#F5F8FD] p-4 text-[13px] leading-6 text-[#404348]">
            <p className="font-medium text-[#0A0626]">Change just one piece of text?</p>
            <p>Open the visual editor, click the text anywhere on the website and use “Text size”. It keeps that size on top of the settings here.</p>
            <Button variant="ghost" className="mt-2" onClick={() => startEditing()}>
              Open the visual editor
            </Button>
          </div>
        </Card>
        <Card title="How it will look">
          <div
            className="cl-root"
            style={{ "--fs-all": sizes.all / 100, "--fs-head": sizes.head / 100, "--fs-body": sizes.body / 100, "--fs-nav": sizes.nav / 100 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary md:text-[13px]">A small label</p>
            <h2 className="mt-2 text-[30px] font-medium leading-[1.15] text-[#31343a] md:text-[40px] md:leading-[48px]">A section heading</h2>
            <p className="mt-3 text-[17px] leading-8 text-[#404348]">This is how a paragraph of body text reads on the website, in a card, a list or a section of a page.</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" tabIndex={-1} className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-7 font-medium text-white">
                A button
              </button>
              <button type="button" tabIndex={-1} className="text-base text-black">
                A menu item
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
