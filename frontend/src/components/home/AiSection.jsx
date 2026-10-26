import React from "react";
import { Check } from "lucide-react";
import { CONTACT, tel } from "./catalog";
import { DIAMONDS } from "./cube-diamonds";
import { ENTERPRISE_FEATURES, MODULES_DATA } from "../../pages/CloudContactCenter";

// Cube's dark AI band. Copy is Cube's own: the "AI Call Management" pitch and the contact center's
// "Artificial Intelligence & Automation" module.
const AI_PITCH = ENTERPRISE_FEATURES.find((f) => f.title === "AI Call Management");
const AI_MODULE = MODULES_DATA.find((m) => m.id === "ai");
// Fixed, not random, so the scene renders the same on every load.
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  size: 2 + (i % 3),
  duration: `${9 + (i % 5) * 2}s`,
  delay: `-${(i * 1.3) % 12}s`,
}));

function Scene() {
  return (
    <div aria-hidden="true" className="cl-ai-scene pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="cl-ai-blob cl-ai-b1" />
      <div className="cl-ai-blob cl-ai-b2" />
      <div className="cl-ai-blob cl-ai-b3" />
      <div className="cl-ai-scan" />
      <div className="cl-ai-grid" />
      <div className="cl-ai-orb">
        <span className="cl-ai-glow" />
        {[0, 1.25, 2.5, 3.75].map((d) => (
          <span key={d} className="cl-ai-ring" style={{ animationDelay: `${d}s` }} />
        ))}
        <span className="cl-ai-orbit">
          {[0, 120, 240].map((a) => (
            <i key={a} style={{ transform: `rotate(${a}deg) translateY(-180px)` }} />
          ))}
        </span>
        <span className="cl-ai-orbit cl-outer">
          {[60, 240].map((a) => (
            <i key={a} style={{ transform: `rotate(${a}deg) translateY(-230px)` }} />
          ))}
        </span>
        <span className="cl-ai-swirl" />
        {/* At the heart of the orb: the logo's 12 diamonds, small, above the Cube AI wordmark */}
        <span className="cl-ai-core">
          <span className="relative block h-[72px] w-[104px]">
            {DIAMONDS.map((d) => (
              <span
                key={`${d.u},${d.v}`}
                className="cl-glint absolute h-[14px] w-[14px] rotate-45 rounded-[3px]"
                style={{ left: 45 + d.u * 13, top: 4 + d.v * 13, background: d.color, boxShadow: `0 0 12px ${d.color}`, animationDelay: `${d.v * 0.14}s` }}
              />
            ))}
          </span>
          <span className="cl-ai-wordmark">Cube AI</span>
        </span>
      </div>
      {PARTICLES.map((p, i) => (
        <span key={i} className="cl-ai-particle" style={{ left: p.left, width: p.size, height: p.size, animationDuration: p.duration, animationDelay: p.delay }} />
      ))}
    </div>
  );
}

export default function AiSection() {
  const [lead, ...rest] = AI_PITCH.description.split(". ");
  return (
    <section className="relative isolate overflow-hidden bg-[#0A0626] px-4 py-14 md:py-20">
      <Scene />
      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#00B8FF]">{AI_PITCH.title}</span>
            <span className="rounded-full bg-[#00B8FF] px-2.5 py-0.5 text-xs font-semibold uppercase leading-4 tracking-[0.04em] text-[#0A0626]">Contact center</span>
          </div>
          <h2 className="mt-5 text-[32px] font-medium leading-[1.12] tracking-[-1px] text-white md:text-[44px]">
            AI that listens, <span className="text-[#00B8FF]">routes, and scores.</span>
          </h2>
          <p className="mt-5 max-w-[600px] text-base leading-[1.6] text-[#B8C4E0] md:text-lg">{rest.join(". ") || lead}</p>
          <ul className="mt-7 flex max-w-[620px] flex-col gap-3">
            {AI_MODULE.items.slice(0, 4).map(({ text }) => (
              <li key={text} className="flex items-start gap-3 text-base leading-6 text-[#D5DEF5]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgb(0_184_255/0.18)] text-[#00B8FF]">
                  <Check size={12} strokeWidth={3} />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
            <a
              href={tel(CONTACT.expert)}
              className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg bg-white px-[22px] text-base font-semibold text-primary transition-colors hover:bg-[#E6EEFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0626]"
            >
              Talk to an expert<span className="hidden lg:inline">&nbsp;· {CONTACT.expert}</span>
            </a>
            <span className="text-sm text-[#9FB0D6]">Hosted or on-premise</span>
          </div>
        </div>
        {/* The orb in the scene fills this column, as on cube*/}
        <div className="hidden min-h-[420px] lg:block" />
      </div>
    </section>
  );
}
