import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, MessagesSquare, MousePointerClick, Phone } from "lucide-react";
import { TiltCard } from "../ui/tilt-card";
import { inView, reveal, revealSpring } from "../../lib/motion";
import SectionIntro from "./SectionIntro";

// Facts come from the site's own product and FAQ copy; the queue rows are illustrative.

// --- Visuals ------------------------------------------------------------------
const CHANNELS = [
  { icon: Phone, label: "Voice" },
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: MessagesSquare, label: "Web chat" },
  { icon: MousePointerClick, label: "Click to call" },
];
const QUEUE = [
  { icon: MessageCircle, text: "Where is my order?", meta: "WhatsApp · 0:12" },
  { icon: Phone, text: "+91 98•• ••• 210", meta: "Voice · 0:31" },
  { icon: MessagesSquare, text: "Pricing for 40 seats", meta: "Web chat · 0:47" },
  { icon: MousePointerClick, text: "Callback from pricing page", meta: "Click to call · 1:05" },
];

function FlowVisual() {
  const row = reveal(useReducedMotion(), "translateX(16px)", "translateX(0px)", 0.08);
  return (
    <motion.div {...inView} aria-hidden="true" className="grid h-full grid-cols-[auto_minmax(3rem,1fr)_minmax(0,1.6fr)] items-stretch gap-3">
      <ul className="flex flex-col justify-around gap-2">
        {CHANNELS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-xs font-medium text-foreground shadow-card ring-1 ring-slate-900/5">
            <Icon size={14} className="text-primary" /> {label}
          </li>
        ))}
      </ul>
      {/* Four channels converge on one queue; the dashes flow toward it */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        {[12.5, 37.5, 62.5, 87.5].map((y) => (
          <path
            key={y}
            d={`M0 ${y} C 55 ${y}, 45 50, 100 50`}
            fill="none"
            className="stroke-primary/40 motion-safe:animate-dash"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="flex flex-col justify-center rounded-2xl bg-secondary/80 p-3 ring-1 ring-slate-900/5">
        <p className="px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">One agent queue</p>
        <ul className="mt-2 space-y-1.5">
          {QUEUE.map(({ icon: Icon, text, meta }, i) => (
            <motion.li key={text} variants={row} custom={i} className="flex items-center gap-2.5 rounded-xl bg-card px-3 py-2 shadow-card">
              <Icon size={14} className="shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-foreground">{text}</span>
                <span className="block font-mono text-[10px] text-muted-foreground">{meta}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function UptimeVisual() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="flex items-center gap-5">
      <svg viewBox="0 0 120 120" className="h-24 w-24 shrink-0 -rotate-90">
        <circle cx="60" cy="60" r="50" fill="none" strokeWidth="10" className="stroke-slate-200" />
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className="stroke-primary"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 0.995 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { ...revealSpring, duration: 1.4 }}
        />
      </svg>
      <p className="font-heading text-5xl font-bold tracking-tight text-foreground">99.5%</p>
    </div>
  );
}

function NumbersVisual() {
  const digit = reveal(useReducedMotion(), "translateY(110%)", "translateY(0%)", 0.08);
  return (
    <motion.div {...inView} aria-hidden="true">
      <p className="flex gap-2 font-mono text-3xl tracking-tight text-foreground">
        {["1800", "419", "••••"].map((group, i) => (
          <span key={group} className="inline-block overflow-hidden">
            <motion.span variants={digit} custom={i} className="inline-block">
              {group}
            </motion.span>
          </span>
        ))}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["Local", "Toll-free", "DID", "Vanity"].map((t) => (
          <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-slate-900/5">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

const PBX = ["Asterisk", "FreePBX", "3CX", "Grandstream", "Cisco"];
function PbxVisual() {
  const chip = reveal(useReducedMotion(), "translateY(10px) scale(0.95)", "translateY(0px) scale(1)", 0.06);
  return (
    <motion.ul {...inView} aria-hidden="true" className="flex flex-wrap gap-2">
      {PBX.map((p, i) => (
        <motion.li
          key={p}
          variants={chip}
          custom={i}
          className="rounded-xl bg-card px-3 py-2 font-mono text-xs text-foreground shadow-card ring-1 ring-slate-900/5"
        >
          {p}
        </motion.li>
      ))}
    </motion.ul>
  );
}

function CrmVisual() {
  return (
    <div aria-hidden="true" className="flex items-center gap-3">
      <span className="rounded-xl bg-foreground px-3 py-2 font-heading text-sm font-bold text-background">Cube</span>
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-3 flex-1">
        <path d="M0 5 L100 5" fill="none" className="stroke-primary motion-safe:animate-dash" strokeWidth="1.5" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="rounded-xl bg-card px-3 py-2 text-xs font-medium text-foreground shadow-card ring-1 ring-slate-900/5">Your CRM</span>
    </div>
  );
}

const YEARS = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];
function HeritageVisual() {
  const fill = reveal(useReducedMotion(), "scaleX(0)", "scaleX(1)");
  return (
    <motion.div {...inView} aria-hidden="true">
      <div className="relative h-8">
        <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
        <motion.span variants={fill} className="absolute inset-x-0 top-1/2 h-px origin-left bg-primary" />
        <div className="absolute inset-0 flex items-center justify-between">
          {YEARS.map((y) => (
            <span key={y} className="h-3 w-px bg-foreground/30" />
          ))}
        </div>
      </div>
      <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>1990</span>
        <span>Today</span>
      </div>
    </motion.div>
  );
}

// --- Grid ---------------------------------------------------------------------
// [4 tall][2] / [2] / [2][2][2]; spans are static strings so Tailwind's JIT sees them.
const CAPABILITIES = [
  {
    title: "Every channel, one queue",
    desc: "Voice, WhatsApp, web chat and click-to-call land in the same omnichannel contact center.",
    Visual: FlowVisual,
    span: "sm:col-span-2 lg:col-span-4 lg:row-span-2",
  },
  { title: "Uptime SLA", desc: "The availability we commit to in our service-level agreement.", Visual: UptimeVisual, span: "lg:col-span-2" },
  { title: "Numbers in minutes", desc: "Local, toll-free, DID and vanity numbers — most active within minutes.", Visual: NumbersVisual, span: "lg:col-span-2" },
  { title: "Fits your PBX", desc: "SIP trunking that works with the PBX you already run.", Visual: PbxVisual, span: "lg:col-span-2" },
  { title: "Talks to your CRM", desc: "Salesforce, Freshdesk or your own, through APIs and CTI connectors.", Visual: CrmVisual, span: "lg:col-span-2" },
  { title: "Built in-house since 1990", desc: "Home-grown telephony software, trusted worldwide.", Visual: HeritageVisual, span: "lg:col-span-2" },
];

export default function Capabilities() {
  const reduce = useReducedMotion();
  // Tiles stand up into place from their bottom edge: tilted back, low and slightly small → upright.
  const tile = reveal(
    reduce,
    "perspective(1200px) rotateX(16deg) translateY(56px) scale(0.96)",
    "perspective(1200px) rotateX(0deg) translateY(0px) scale(1)",
    0.07
  );

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionIntro
          label="Platform"
          title="Infrastructure you don't have to think about."
          body="The parts of telephony that usually break are the parts we've spent 35 years building ourselves."
        />

        <motion.ul {...inView} className="mt-16 grid gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(17rem,auto)] lg:grid-cols-6">
          {CAPABILITIES.map(({ title, desc, Visual, span }, i) => (
            <motion.li key={title} variants={tile} custom={i} style={{ transformOrigin: "50% 100%" }} className={span}>
              <TiltCard className="flex flex-col overflow-hidden rounded-3xl border bg-card p-6 shadow-card transition-shadow duration-300 hover:shadow-elevated sm:p-7">
                <div className="relative flex min-h-[7rem] flex-1 items-center">
                  <div className="w-full">
                    <Visual />
                  </div>
                </div>
                <div className="relative mt-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </TiltCard>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
