import React from "react";
import { motion, useMotionTemplate, useReducedMotion, useTransform } from "framer-motion";
import { Check, Mic, Pause, PhoneForwarded, Users } from "lucide-react";
import { ease, inView, reveal } from "../../lib/motion";
import { waveHeights } from "./call-math";

// Illustrative UI for each stage of the call. Numbers and names are mock data, not claims.
// Every visual settles in when it scrolls into view, so it works both pinned and stacked.

const PANEL = "rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.07]";
const useSettle = (from, to, step = 0.05) => reveal(useReducedMotion(), from, to, step);

// Connector diagrams stretch to fill their box (preserveAspectRatio="none" + non-scaling strokes), so lines
// always meet the %-positioned chips at any size. They "grow" with a clip reveal in the direction of travel.
const CLIP_FROM = { down: "inset(0 0 100% 0)", right: "inset(0 100% 0 0)" };
const useGrow = () => {
  const reduce = useReducedMotion();
  return (direction, delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { clipPath: CLIP_FROM[direction] },
    whileInView: reduce ? { opacity: 1 } : { clipPath: "inset(0 0% 0% 0)" },
    viewport: { once: true },
    transition: { duration: reduce ? 0.2 : 0.7, ease, delay },
  });
};
const STRETCH = { viewBox: "0 0 100 100", preserveAspectRatio: "none", className: "absolute inset-0 h-full w-full overflow-visible" };

// --- 01 Dial ----------------------------------------------------------------
const DIAL_MODES = ["Predictive", "Progressive", "Preview"];
const DIAL_ROWS = [
  { number: "+91 98•• ••• 210", status: "Connected", tone: "text-emerald-400", dot: "bg-emerald-400" },
  { number: "+91 99•• ••• 044", status: "Ringing", tone: "text-blue-400", dot: "bg-blue-400 motion-safe:animate-pulse" },
  { number: "+91 97•• ••• 873", status: "Dialing", tone: "text-foreground/80", dot: "bg-foreground/60 motion-safe:animate-pulse" },
  { number: "+91 90•• ••• 518", status: "No answer · retry 15:30", tone: "text-muted-foreground", dot: "bg-muted-foreground/60" },
  { number: "+91 88•• ••• 362", status: "Queued", tone: "text-muted-foreground", dot: "bg-muted-foreground/40" },
];

export function DialVisual() {
  const row = useSettle("translateX(-14px)", "translateX(0px)");
  return (
    <motion.div {...inView} className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className={`flex gap-1 p-1 ${PANEL} rounded-full`}>
          {DIAL_MODES.map((mode, i) => (
            <span key={mode} className={`rounded-full px-3 py-1 text-xs font-medium ${i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {mode}
            </span>
          ))}
        </div>
        <span className="font-mono text-xs text-muted-foreground">2.4 lines / agent</span>
      </div>
      <ul className="mt-5 space-y-2">
        {DIAL_ROWS.map((r, i) => (
          <motion.li key={r.number} variants={row} custom={i} className={`flex items-center justify-between gap-3 px-4 py-3 ${PANEL} rounded-xl`}>
            <span className="font-mono text-sm tabular-nums text-foreground">{r.number}</span>
            <span className={`flex items-center gap-2 text-right text-xs ${r.tone}`}>
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${r.dot}`} />
              {r.status}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

// --- 02 Greet (IVR) ---------------------------------------------------------
// Chip positions in % of the diagram box; the SVG lines use the same 0–100 coordinates.
const IVR_NODES = [
  { label: "Greeting", x: 50, y: 12, chosen: true },
  { label: "1 · Sales", x: 17, y: 52 },
  { label: "2 · Support", x: 50, y: 52, chosen: true },
  { label: "3 · Billing", x: 83, y: 52 },
  { label: "Support · English queue", x: 50, y: 88, chosen: true },
];

export function IvrVisual() {
  const grow = useGrow();
  const node = useSettle("translateY(8px) scale(0.96)", "translateY(0px) scale(1)", 0.12);
  return (
    <motion.div {...inView} className="flex h-full flex-col">
      <p className="font-mono text-xs text-muted-foreground">
        Caller pressed <span className="text-foreground">2</span> · 4s in IVR
      </p>
      <div className="relative mt-4 min-h-0 flex-1">
        <motion.svg aria-hidden="true" {...STRETCH} {...grow("down")}>
          {[17, 50, 83].map((x) => (
            <path key={x} d={`M50 12 L${x} 52`} className="stroke-white/15" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
          ))}
        </motion.svg>
        {/* The route the caller actually took, in brand blue */}
        <motion.svg aria-hidden="true" {...STRETCH} {...grow("down", 0.4)}>
          <path d="M50 12 L50 88" className="stroke-primary" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
        </motion.svg>
        {IVR_NODES.map((n, i) => (
          <motion.span
            key={n.label}
            variants={node}
            custom={i}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            className={`absolute whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium [translate:-50%_-50%] ${
              n.chosen ? "bg-primary text-primary-foreground shadow-glow" : `${PANEL} text-muted-foreground`
            }`}
          >
            {n.label}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// --- 03 Route ---------------------------------------------------------------
const AGENTS = [
  { name: "Ananya S.", skills: "Sales · Hindi", state: "On call", y: 18 },
  { name: "Rohit K.", skills: "Support · English", state: "Available", y: 50, chosen: true },
  { name: "Meera P.", skills: "Billing · Tamil", state: "On call", y: 82 },
];

export function RouteVisual() {
  const grow = useGrow();
  const card = useSettle("translateX(14px)", "translateX(0px)", 0.08);
  // Caller chip ends at 27% of the width, agent chips start at 56%.
  const connector = (a) => `M27 50 C 42 50, 41 ${a.y}, 56 ${a.y}`;
  return (
    <motion.div {...inView} className="flex h-full flex-col">
      <p className="font-mono text-xs text-muted-foreground">Matched on language and skill</p>
      <div className="relative mt-4 min-h-0 flex-1">
        <motion.svg aria-hidden="true" {...STRETCH} {...grow("right")}>
          {AGENTS.filter((a) => !a.chosen).map((a) => (
            <path key={a.name} d={connector(a)} className="stroke-white/15" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
          ))}
        </motion.svg>
        {/* The agent the call was matched to */}
        <motion.svg aria-hidden="true" {...STRETCH} {...grow("right", 0.4)}>
          {AGENTS.filter((a) => a.chosen).map((a) => (
            <path key={a.name} d={connector(a)} className="stroke-primary" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
          ))}
        </motion.svg>
        <span className={`absolute left-0 top-1/2 w-[27%] -translate-y-1/2 px-3 py-2.5 text-xs ${PANEL} rounded-xl`}>
          <span className="block font-medium text-foreground">Caller</span>
          <span className="mt-0.5 block text-muted-foreground">English · support</span>
        </span>
        {AGENTS.map((a, i) => (
          <motion.span
            key={a.name}
            variants={card}
            custom={i}
            style={{ top: `${a.y}%` }}
            className={`absolute left-[56%] flex w-[44%] items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs [translate:0_-50%] ${
              a.chosen ? "bg-primary/15 ring-1 ring-inset ring-primary/60" : PANEL
            }`}
          >
            <span className="min-w-0">
              <span className="block truncate font-medium text-foreground">{a.name}</span>
              <span className="mt-0.5 block truncate text-muted-foreground">{a.skills}</span>
            </span>
            {/* Status as a dot on phones; the word joins it from sm up */}
            <span className={`flex shrink-0 items-center gap-1.5 ${a.chosen ? "text-emerald-400" : "text-muted-foreground"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${a.chosen ? "bg-emerald-400" : "bg-white/30"}`} />
              <span className="hidden sm:inline">{a.state}</span>
            </span>
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// --- 04 Talk ----------------------------------------------------------------
const LIVE = waveHeights(32);
const CONTROLS = [
  { icon: Mic, label: "Mute" },
  { icon: Pause, label: "Hold" },
  { icon: PhoneForwarded, label: "Transfer" },
  { icon: Users, label: "Conference" },
];
const WALLBOARD = [
  { label: "In queue", value: "3" },
  { label: "Avg wait", value: "0:18" },
  { label: "SLA", value: "98.2%" },
];

export function TalkVisual({ clock }) {
  return (
    <motion.div {...inView} className="flex h-full flex-col gap-3">
      <div className={`flex items-center justify-between p-4 ${PANEL}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-blue-300">RK</span>
          <div>
            <p className="text-sm font-medium text-foreground">Rohit K.</p>
            <p className="text-xs text-muted-foreground">Support · English</p>
          </div>
        </div>
        <span className="flex items-center gap-2 font-mono text-sm tabular-nums text-foreground">
          <span className="h-2 w-2 rounded-full bg-red-500 motion-safe:animate-pulse" />
          <motion.span>{clock}</motion.span>
        </span>
      </div>

      <div className={`flex-1 p-4 ${PANEL}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-muted-foreground">+91 99•• ••• 044</span>
          <span className="text-emerald-400">Returning customer</span>
        </div>
        {/* Caller in blue, agent in white: the two voices alternating */}
        <div aria-hidden="true" className="mt-3 flex h-14 items-center gap-[3px]">
          {LIVE.map((h, i) => (
            <span
              key={i}
              className={`flex-1 rounded-full motion-safe:animate-wave ${i % 8 < 4 ? "bg-primary" : "bg-white/60"}`}
              style={{ height: `${h * 100}%`, animationDuration: `${1.3 + (i % 5) / 5}s`, animationDelay: `-${(i % 7) / 4}s` }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {CONTROLS.map(({ icon: Icon, label }) => (
          <span key={label} className={`flex flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground ${PANEL} rounded-xl`}>
            <Icon size={15} className="text-foreground/80" />
            {label}
          </span>
        ))}
      </div>

      <div className={`grid grid-cols-3 divide-x divide-white/[0.07] ${PANEL}`}>
        {WALLBOARD.map((w) => (
          <span key={w.label} className="px-3 py-2.5">
            <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{w.label}</span>
            <span className="mt-0.5 block font-heading text-lg font-semibold text-foreground">{w.value}</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// --- 05 Record --------------------------------------------------------------
const REC = waveHeights(56);
const REC_FACTS = [
  "Captured from SIP, analog or digital lines",
  "Screen recording synced with the audio",
  "Archived across sites with InSync",
  "Searchable by number, agent and date",
];

const RecBars = ({ className }) => (
  <div className={`flex h-full items-center gap-[3px] ${className}`}>
    {REC.map((h, i) => (
      <span key={i} className="flex-1 rounded-full bg-current" style={{ height: `${h * 80}%` }} />
    ))}
  </div>
);

// `progress` (0–1) is how far through the Record stage you've scrolled; the saved part fills in blue.
export function RecordVisual({ progress }) {
  const rest = useTransform(progress, (p) => (1 - p) * 100);
  const clip = useMotionTemplate`inset(0 ${rest}% 0 0)`;
  const fact = useSettle("translateY(8px)", "translateY(0px)", 0.07);
  return (
    <motion.div {...inView} className="flex h-full flex-col">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-foreground">call_0441.wav</span>
        <span className="text-muted-foreground">04:12 · 3.9 MB</span>
      </div>
      <div className={`relative mt-4 h-28 px-4 ${PANEL}`} aria-hidden="true">
        <RecBars className="text-white/15" />
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 px-4">
          <RecBars className="text-primary" />
        </motion.div>
      </div>
      <ul className="mt-5 space-y-2.5">
        {REC_FACTS.map((f, i) => (
          <motion.li key={f} variants={fact} custom={i} className="flex items-center gap-3 text-sm text-foreground/90">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400">
              <Check size={12} strokeWidth={3} />
            </span>
            {f}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

// --- 06 Bill ----------------------------------------------------------------
const ALLOCATION = [
  { dept: "Support", share: 46 },
  { dept: "Sales", share: 33 },
  { dept: "Billing", share: 21 },
];

export function BillVisual() {
  const bar = useSettle("scaleX(0)", "scaleX(1)", 0.1);
  return (
    <motion.div {...inView} className="flex h-full flex-col">
      <div className={`p-4 ${PANEL}`}>
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-muted-foreground">call_0441 · 04:13 · SIP-02</span>
          <span className="text-sm text-foreground">₹3.80</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {["Dept · Support", "Branch · Noida", "Ext · 2041"].map((tag) => (
            <span key={tag} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-foreground/80">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">This month by department</p>
      <ul className="mt-3 space-y-3">
        {ALLOCATION.map((a, i) => (
          <li key={a.dept} className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-3 text-sm">
            <span className="text-foreground/90">{a.dept}</span>
            <span className="h-2 rounded-full bg-white/[0.08]">
              <motion.span variants={bar} custom={i} style={{ width: `${a.share}%` }} className="block h-full origin-left rounded-full bg-primary" />
            </span>
            <span className="text-right font-mono text-xs text-muted-foreground">{a.share}%</span>
          </li>
        ))}
      </ul>

      <p className="mt-auto flex items-center gap-2 pt-5 text-sm text-emerald-400">
        <Check size={15} strokeWidth={3} /> Posted to the monthly cost report
      </p>
    </motion.div>
  );
}
