import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { api } from "../lib/api";
import { FESTIVAL_LIST } from "../lib/festivals";
import { THEMES } from "../festival/themes";
import { Card, Empty, INPUT, PageTitle, Toggle, act, useResource } from "./ui";

// Dress the website for a festival: one at a time, on or off with a switch. Its colours, decorations and scroll
// animation go on top of the site, so no text, picture or edit is changed, and everything goes back when it's off.

const SCROLL = {
  diya: "A diya travels down the page and lights lamps as you scroll",
  pichkari: "A pichkari sprays colour along the top as you scroll",
  dandiya: "Dandiya sticks spin down a thread of lights",
  lotus: "A lotus floats down a thread of lights",
  rakhi: "A rakhi turns down a golden thread",
  flag: "The flag rises up its pole as you scroll",
  kite: "A kite climbs its string as you scroll",
  crescent: "A crescent moon travels down a thread of lights",
  bauble: "A bauble bobs down a string of lights",
  rocket: "A rocket climbs the page as you scroll",
};

export default function FestivalsAdmin({ out }) {
  const [data, reload] = useResource("/admin/settings", out);
  const [f, setF] = useState(null);
  useEffect(() => {
    if (data) setF({ active: null, scroll: true, effects: true, popup: true, greetings: {}, ...(data.festival || {}) });
  }, [data]);
  if (!f) return <Empty>Loading...</Empty>;

  const store = async (next, message) => {
    setF(next);
    if (!(await act(() => api("/admin/settings/festival", { method: "PUT", body: { value: next } }), message))) reload();
  };
  const running = FESTIVAL_LIST.find((x) => x.key === f.active);

  return (
    <>
      <PageTitle
        title="Festivals"
        desc="Dress the whole website for a festival with one switch. Only one can be on at a time. Your text, pictures and edits are never changed: everything goes back the moment you switch it off."
        actions={
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE2EE] bg-white px-3.5 py-2 text-[14px] font-medium text-[#0A0626] hover:bg-[#F0F4FB]">
            View website <ExternalLink size={14} />
          </a>
        }
      />

      <div className={`mb-6 rounded-2xl border p-4 text-[14px] ${running ? "border-[#BFE8CF] bg-[#F1FBF5] text-[#0F6B3A]" : "border-[#E5EAF4] bg-white text-[#6B6E75]"}`}>
        {running ? (
          <>
            <b>{running.name}</b> is live on the website now.
          </>
        ) : (
          "No festival is on. The website shows its usual look."
        )}
      </div>

      <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {FESTIVAL_LIST.map((x) => {
          const theme = THEMES[x.key];
          const on = f.active === x.key;
          return (
            <li key={x.key} className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition-colors ${on ? "border-[#16A34A]" : "border-[#E5EAF4]"}`}>
              <div className="flex h-16 items-end justify-end gap-1 p-2" style={{ background: theme.grad }}>
                {theme.swatch.map((c, i) => (
                  <span key={i} className="h-4 w-4 rounded-full ring-1 ring-white/70" style={{ background: c }} />
                ))}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-[16px] font-medium text-[#0A0626]">{x.name}</span>
                    <span className="block text-[12px] text-[#6B6E75]">{x.when}</span>
                  </span>
                  <Toggle on={on} label={`${x.name} theme`} onChange={(v) => store({ ...f, active: v ? x.key : null }, v ? `${x.name} is live on the website` : `${x.name} is off. The website is back to its usual look.`)} />
                </div>
                <p className="mt-2 flex-1 text-[13px] leading-5 text-[#404348]">{SCROLL[theme.rider]}.</p>
                <label className="mt-3 block text-[12px] font-medium text-[#404348]">
                  Greeting
                  <input
                    value={f.greetings[x.key] ?? x.greeting}
                    maxLength={140}
                    onChange={(e) => setF({ ...f, greetings: { ...f.greetings, [x.key]: e.target.value } })}
                    onBlur={() => JSON.stringify(data?.festival?.greetings?.[x.key]) !== JSON.stringify(f.greetings[x.key]) && f.greetings[x.key] !== undefined && f.greetings[x.key].trim() && store(f, "Greeting saved")}
                    className={`${INPUT} mt-1`}
                  />
                </label>
                <a href={`/?festival=${x.key}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 self-start text-[13px] font-medium text-primary hover:underline">
                  Preview without switching it on <ExternalLink size={13} />
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <Card title="What a festival includes" className="mt-6">
        <ul className="space-y-3 text-[14px] text-[#404348]">
          {[
            ["scroll", "Scroll animation", "The diya, pichkari or other motif that moves as visitors scroll."],
            ["effects", "Drifting decorations", "Sparks, colour, petals or snow drifting gently across the page, and fireworks at the top."],
            ["popup", "Greeting pop-up", "A small greeting once per visit. The greeting also runs in the bar at the top of the website."],
          ].map(([key, label, hint]) => (
            <li key={key} className="flex items-center justify-between gap-4">
              <span>
                <span className="block font-medium text-[#0A0626]">{label}</span>
                <span className="block text-[12px] text-[#6B6E75]">{hint}</span>
              </span>
              <Toggle on={f[key]} label={label} onChange={(v) => store({ ...f, [key]: v }, "Saved")} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] text-[#6B6E75]">Visitors who ask their device for reduced motion get the colours and greeting without the moving parts.</p>
      </Card>
    </>
  );
}
