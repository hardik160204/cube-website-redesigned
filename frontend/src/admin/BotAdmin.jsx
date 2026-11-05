import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { DEFAULT_BOT } from "../lib/bot";
import { Button, Card, Empty, Field, INPUT, PageTitle, Toggle, act, useResource } from "./ui";
import { IconSelect } from "./PagesAdmin";

// Cube the bot: what it says, the buttons in its panel and where they go, and the questions it answers.

const swap = (list, i, j) => {
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};
const PHONE = /^\+?[\d\s()-]{7,}$/;
const digits = (s) => s.replace(/\D/g, "");

// The built-in numbers as the visitor sees them: your site edits to a phone number apply here too.
function withEditedPhones(bot, overrides) {
  const edits = overrides.filter((o) => o.kind === "text" && o.scope === "*" && PHONE.test(o.original) && PHONE.test(o.replacement));
  const text = (s) => edits.reduce((out, e) => out.split(e.original).join(e.replacement), s);
  const link = (h) => {
    const e = h.startsWith("tel:") && edits.find((x) => digits(x.original) === digits(h));
    return e ? `tel:${e.replacement.replace(/[^\d+]/g, "")}` : h;
  };
  return { ...bot, actions: bot.actions.map((a) => ({ ...a, sub: text(a.sub), href: link(a.href) })), faqs: bot.faqs.map((f) => ({ q: f.q, a: text(f.a) })) };
}

export default function BotAdmin({ out }) {
  const [data, reload] = useResource("/admin/settings", out);
  const [bot, setBot] = useState(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!data) return;
    if (data.bot) return setBot(data.bot);
    api("/content")
      .then(({ overrides }) => setBot(withEditedPhones(structuredClone(DEFAULT_BOT), overrides)))
      .catch(() => setBot(structuredClone(DEFAULT_BOT)));
  }, [data]);
  if (!bot) return <Empty>Loading...</Empty>;

  const set = (patch) => {
    setBot({ ...bot, ...patch });
    setDirty(true);
  };
  const action = (i, patch) => set({ actions: bot.actions.map((a, k) => (k === i ? { ...a, ...patch } : a)) });
  const faq = (i, patch) => set({ faqs: bot.faqs.map((f, k) => (k === i ? { ...f, ...patch } : f)) });
  const save = async () => {
    if (await act(() => api("/admin/settings/bot", { method: "PUT", body: { value: bot } }), "Saved. The bot is updated on the website.")) {
      setDirty(false);
      reload();
    }
  };

  return (
    <>
      <PageTitle
        title="Chat bot"
        desc="Cube, the little robot in the corner of every page: what it says, its buttons and links, and the questions it answers."
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

      <div className="space-y-6">
        <Card title="Show the bot">
          <div className="flex items-center justify-between gap-4 text-[14px]">
            <span className="text-[#404348]">Show Cube on every page of the website.</span>
            <Toggle on={bot.enabled !== false} label="Show the bot" onChange={(enabled) => set({ enabled })} />
          </div>
        </Card>

        <Card title="What it says">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Panel title">
              <input value={bot.title} maxLength={60} onChange={(e) => set({ title: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Line under the title">
              <input value={bot.subtitle} maxLength={100} onChange={(e) => set({ subtitle: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Small label in its speech bubble">
              <input value={bot.status} maxLength={40} onChange={(e) => set({ status: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Speech bubble, most pages">
              <input value={bot.bubbles.default} maxLength={160} onChange={(e) => set({ bubbles: { ...bot.bubbles, default: e.target.value } })} className={INPUT} />
            </Field>
            <Field label="Speech bubble, on the pricing page">
              <input value={bot.bubbles.pricing} maxLength={160} onChange={(e) => set({ bubbles: { ...bot.bubbles, pricing: e.target.value } })} className={INPUT} />
            </Field>
            <Field label="Speech bubble, on product and service pages">
              <input value={bot.bubbles.services} maxLength={160} onChange={(e) => set({ bubbles: { ...bot.bubbles, services: e.target.value } })} className={INPUT} />
            </Field>
            <Field label="Speech bubble, on industry pages">
              <input value={bot.bubbles.industries} maxLength={160} onChange={(e) => set({ bubbles: { ...bot.bubbles, industries: e.target.value } })} className={INPUT} />
            </Field>
          </div>
        </Card>

        <Card
          title={`Buttons in its panel (${bot.actions.length})`}
          actions={
            <Button variant="ghost" disabled={bot.actions.length >= 8} onClick={() => set({ actions: [...bot.actions, { label: "", sub: "", icon: "Link2", href: "" }] })}>
              <Plus size={15} /> Add a button
            </Button>
          }
        >
          <ul className="space-y-3">
            {bot.actions.map((a, i) => {
              const isDemo = a.href === "demo:";
              return (
                <li key={i} className="grid gap-2 rounded-xl border border-[#E5EAF4] p-3 md:grid-cols-[170px_1fr_1fr_auto]">
                  <IconSelect value={a.icon} onChange={(icon) => action(i, { icon })} />
                  <span className="grid gap-2">
                    <input placeholder="Button name" value={a.label} maxLength={40} onChange={(e) => action(i, { label: e.target.value })} className={INPUT} aria-label="Button name" />
                    <input placeholder="Small line under it (optional)" value={a.sub} maxLength={60} onChange={(e) => action(i, { sub: e.target.value })} className={INPUT} aria-label="Small line" />
                  </span>
                  <span className="grid content-start gap-2">
                    <select value={isDemo ? "demo" : "link"} onChange={(e) => action(i, { href: e.target.value === "demo" ? "demo:" : "" })} className={INPUT} aria-label="What it does">
                      <option value="demo">Opens the demo booking</option>
                      <option value="link">Opens a link</option>
                    </select>
                    {!isDemo && <input placeholder="/contact, https://..., tel:+91... or mailto:..." value={a.href} maxLength={500} onChange={(e) => action(i, { href: e.target.value.trim() })} className={`${INPUT} font-mono text-[13px]`} aria-label="Link" />}
                  </span>
                  <span className="flex gap-1.5 md:flex-col">
                    <Button variant="ghost" className="px-2" disabled={i === 0} onClick={() => set({ actions: swap(bot.actions, i, i - 1) })} aria-label="Move up">
                      <ArrowUp size={14} />
                    </Button>
                    <Button variant="ghost" className="px-2" disabled={i === bot.actions.length - 1} onClick={() => set({ actions: swap(bot.actions, i, i + 1) })} aria-label="Move down">
                      <ArrowDown size={14} />
                    </Button>
                    <Button variant="danger" className="px-2" onClick={() => set({ actions: bot.actions.filter((_, k) => k !== i) })} aria-label="Remove button">
                      <Trash2 size={14} />
                    </Button>
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card
          title={`Questions it answers (${bot.faqs.length})`}
          actions={
            <Button variant="ghost" disabled={bot.faqs.length >= 20} onClick={() => set({ faqs: [...bot.faqs, { q: "", a: "" }] })}>
              <Plus size={15} /> Add a question
            </Button>
          }
        >
          <Field label="Heading above the questions" className="mb-4 max-w-md">
            <input value={bot.questionsTitle} maxLength={60} onChange={(e) => set({ questionsTitle: e.target.value })} className={INPUT} />
          </Field>
          <ul className="space-y-3">
            {bot.faqs.map((f, i) => (
              <li key={i} className="grid gap-2 rounded-xl border border-[#E5EAF4] p-3 md:grid-cols-[1fr_1.6fr_auto]">
                <input placeholder="Question" value={f.q} maxLength={160} onChange={(e) => faq(i, { q: e.target.value })} className={INPUT} aria-label="Question" />
                <textarea placeholder="Answer" rows={3} value={f.a} maxLength={1000} onChange={(e) => faq(i, { a: e.target.value })} className={INPUT} aria-label="Answer" />
                <span className="flex gap-1.5 md:flex-col">
                  <Button variant="ghost" className="px-2" disabled={i === 0} onClick={() => set({ faqs: swap(bot.faqs, i, i - 1) })} aria-label="Move up">
                    <ArrowUp size={14} />
                  </Button>
                  <Button variant="ghost" className="px-2" disabled={i === bot.faqs.length - 1} onClick={() => set({ faqs: swap(bot.faqs, i, i + 1) })} aria-label="Move down">
                    <ArrowDown size={14} />
                  </Button>
                  <Button variant="danger" className="px-2" onClick={() => set({ faqs: bot.faqs.filter((_, k) => k !== i) })} aria-label="Remove question">
                    <Trash2 size={14} />
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="sticky bottom-3 z-10 flex items-center justify-end gap-3 rounded-2xl border border-[#E5EAF4] bg-white p-3 shadow-[0_12px_30px_-18px_rgb(10_6_38/0.4)]">
          <span className={`text-[13px] ${dirty ? "text-[#9A5B00]" : "text-[#0F6B3A]"}`}>{dirty ? "You have unsaved changes" : "Everything is saved"}</span>
          <Button disabled={!dirty} onClick={save}>
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
