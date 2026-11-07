import React, { useState } from "react";

// Charts for Visitor analytics. Colours: the validated categorical order (dataviz reference palette, slots 1-6),
// always with each part's name, count and share beside it, so no reading depends on colour alone.
export const SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300"];
const OTHER = "#8B8F97";

// More than six parts: the smallest are folded into "Other".
const fold = (rows) => (rows.length <= 6 ? rows : [...rows.slice(0, 5), { label: "Other", n: rows.slice(5).reduce((s, r) => s + r.n, 0), other: true }]);

// A pie (donut) of how one whole splits, with a legend that lists every part's count and share.
export function Pie({ rows, label }) {
  const [hover, setHover] = useState(null);
  const parts = fold(rows || []);
  const total = parts.reduce((s, r) => s + r.n, 0);
  if (!total) return <p className="py-6 text-center text-[13px] text-[#6B6E75]">No data yet.</p>;
  const R = 52;
  const C = 2 * Math.PI * R;
  let at = 0;
  const arcs = parts.map((r, i) => {
    const len = (r.n / total) * C;
    const arc = { ...r, color: r.other ? OTHER : SERIES[i], dash: `${Math.max(len - (parts.length > 1 ? 2 : 0), 0.5)} ${C}`, offset: -at };
    at += len;
    return arc;
  });
  const shown = hover != null ? arcs[hover] : null;
  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg viewBox="0 0 140 140" className="h-[140px] w-[140px] shrink-0 -rotate-90" role="img" aria-label={`${label}: ${arcs.map((a) => `${a.label} ${Math.round((a.n / total) * 100)}%`).join(", ")}`}>
        <circle cx="70" cy="70" r={R} fill="none" stroke="#EEF1F7" strokeWidth="22" />
        {arcs.map((a, i) => (
          <circle
            key={a.label}
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke={a.color}
            strokeWidth={hover === i ? 26 : 22}
            strokeDasharray={a.dash}
            strokeDashoffset={a.offset}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="cursor-default transition-[stroke-width] duration-150"
          />
        ))}
        <text x="70" y="70" transform="rotate(90 70 70)" textAnchor="middle" dominantBaseline="central" className="fill-[#0A0626] text-[15px] font-medium">
          {shown ? `${Math.round((shown.n / total) * 100)}%` : total.toLocaleString("en-IN")}
        </text>
      </svg>
      <ul className="min-w-[160px] flex-1 space-y-1.5 text-[13px]">
        {arcs.map((a, i) => (
          <li key={a.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className={`flex items-center gap-2 rounded px-1 ${hover === i ? "bg-[#F5F8FD]" : ""}`}>
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: a.color }} />
            <span className="min-w-0 flex-1 truncate text-[#0A0626]">{a.label}</span>
            <span className="shrink-0 tabular-nums text-[#6B6E75]">
              {a.n.toLocaleString("en-IN")} · {Math.round((a.n / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Ranked horizontal bars, largest first, one colour: for comparing items (pages, cities, sources).
export function RankedBars({ rows, total }) {
  if (!rows?.length) return <p className="py-6 text-center text-[13px] text-[#6B6E75]">No data yet.</p>;
  const top = Math.max(...rows.map((r) => r.n), 1);
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="text-[13px]" title={`${r.label}: ${r.n}`}>
          <div className="flex justify-between gap-3">
            <span className="truncate text-[#0A0626]">{r.label}</span>
            <span className="shrink-0 tabular-nums text-[#6B6E75]">
              {r.n.toLocaleString("en-IN")}
              {total ? ` · ${Math.round((r.n / Math.max(total, 1)) * 100)}%` : ""}
            </span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-[#EEF1F7]">
            <div className="h-2 rounded-full bg-[#2a78d6]" style={{ width: `${Math.max(2, (r.n / top) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

// Page views per day: columns on one baseline, with the day and count on hover (and keyboard focus).
export function Columns({ days }) {
  const [hover, setHover] = useState(null);
  if (!days?.length) return <p className="py-6 text-center text-[13px] text-[#6B6E75]">No page views in this period yet.</p>;
  const peak = Math.max(1, ...days.map((d) => d.n));
  const fmt = (d) => new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const h = hover != null ? days[hover] : null;
  return (
    <div>
      <div className="mb-2 flex h-5 items-baseline justify-between text-[12px] text-[#6B6E75]">
        <span>{h ? `${fmt(h.day)}: ${h.n.toLocaleString("en-IN")} views` : `Highest day: ${peak.toLocaleString("en-IN")} views`}</span>
      </div>
      <div className="relative flex h-40 items-end justify-center gap-[2px] border-b border-[#DCE2EE]" role="img" aria-label={`Page views per day, highest ${peak}`}>
        {[0.5, 1].map((f) => (
          <div key={f} aria-hidden="true" className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#EEF1F7]" style={{ bottom: `${f * 100}%` }} />
        ))}
        {days.map((d, i) => (
          <button
            key={d.day}
            type="button"
            tabIndex={0}
            aria-label={`${fmt(d.day)}: ${d.n} views`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className="group relative flex h-full max-w-[56px] flex-1 items-end focus:outline-none"
          >
            <span className={`block w-full rounded-t-[4px] ${hover === i ? "bg-[#1d5fb0]" : "bg-[#2a78d6]"}`} style={{ height: `${Math.max(2, (d.n / peak) * 100)}%` }} />
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-[#6B6E75]">
        <span>{fmt(days[0].day)}</span>
        <span>{fmt(days[days.length - 1].day)}</span>
      </div>
    </div>
  );
}
