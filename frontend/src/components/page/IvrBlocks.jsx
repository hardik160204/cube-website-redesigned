import React, { useState } from "react";
import { BarChart3, Clock, FileText, Hash, Mic, Phone, Settings, Users } from "lucide-react";
import FlowChart from "../home/FlowChart";
import { Heading, Reveal, Section } from "./kit";

// The Cloud IVR page's two interactive pieces: its savings calculator (same maths and copy as before)
// and its multi-level IVR diagram, now drawn by the homepage's animated flowchart.

const humanCostPerCall = 20000 / 3000;
const ivrCostPerCall = 1800 / 3000;
const MAX = 50000;

export function IvrSavings() {
  const [callVolume, setCallVolume] = useState(15000);
  const humanCost = Math.round(callVolume * humanCostPerCall);
  const ivrCost = Math.round(callVolume * ivrCostPerCall);
  const totalSavings = humanCost - ivrCost;
  const pct = (callVolume / MAX) * 100;

  return (
    <Section tone="dark">
      <Heading
        title="Savings Calculator for Interactive Voice Response"
        body="Consider a human receptionist answers 3000 calls a month, and is being paid a salary of Rs.20,000. Here is a representation of your savings potential if an IVR replaces a human."
        align="center"
        dark
      />
      <Reveal className="mx-auto mt-12 max-w-[860px] rounded-[28px] border border-white/10 bg-white/[0.04] p-6 sm:p-10">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-medium text-white">Calls Per Month</h3>
          <span className="font-mono text-2xl text-[#00B8FF]">{Number(callVolume).toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="0"
          max={MAX}
          step="500"
          value={callVolume}
          onChange={(e) => setCallVolume(Number(e.target.value))}
          aria-label="Calls Per Month"
          className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full accent-[#00B8FF]"
          style={{ background: `linear-gradient(90deg, #00B8FF ${pct}%, rgb(255 255 255 / 0.15) ${pct}%)` }}
        />
        <div className="mt-3 flex justify-between font-mono text-sm text-[#8FA0C8]">
          <span>0</span>
          <span>50,000</span>
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Human Cost", value: humanCost },
            { label: "IVR Cost", value: ivrCost },
            { label: "You Save", value: totalSavings > 0 ? totalSavings : 0, save: true },
          ].map((c) => (
            <div
              key={c.label}
              className={`rounded-[20px] p-5 text-center ${c.save ? "bg-[linear-gradient(135deg,#00B8FF,#0047FF)] text-white shadow-[0_20px_40px_-20px_rgb(0_184_255/0.9)]" : "bg-white text-[#0A0626]"}`}
            >
              <dt className={`text-xs font-semibold uppercase tracking-[0.12em] ${c.save ? "text-white/80" : "text-[#6B6E75]"}`}>{c.label}</dt>
              <dd className="mt-2 text-3xl font-medium tabular-nums">₹{c.value.toLocaleString()}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 space-y-1 text-center text-sm text-[#8FA0C8]">
          <p>Disclaimer: Extra charges applicable for toll free numbers</p>
          <p>Disclaimer: Call rates vary based on volumes</p>
        </div>
      </Reveal>
    </Section>
  );
}

const n = (icon, label, sub) => ({ icon, label, sub });
const IVR_STAGES = [
  [n(Users, "Customer", "Customer Facing Number")],
  [n(Phone, "IVR", "Multi-level IVR")],
  [n(Hash, "Press 1"), n(Hash, "Press 2"), n(Hash, "Press 3")],
  [n(Users, "Sales"), n(Clock, "24/7 Support"), n(FileText, "Billing")],
];
const ALONGSIDE = [
  { icon: Mic, label: "Call Recording" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Settings, label: "Automate" },
];

export function IvrDiagram() {
  return (
    <Section tone="tint">
      <Heading label="Multi-level IVR number system" title="Automate your business communication with" align="center" />
      <Reveal className="mt-12">
        <FlowChart stages={IVR_STAGES} title="Multi-level IVR number system" className="mx-auto max-w-[980px]" />
      </Reveal>
      <ul className="mt-6 flex flex-wrap justify-center gap-3">
        {ALONGSIDE.map((a, i) => (
          <Reveal as="li" key={a.label} delay={0.1 + i * 0.08} className="flex items-center gap-2 rounded-full border border-[#E5EAF4] bg-white px-4 py-2 text-[15px] text-[#31343A]">
            <a.icon size={16} className="text-primary" /> {a.label}
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
