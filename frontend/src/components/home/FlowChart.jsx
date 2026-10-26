import React, { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HEIGHT, layoutFlow, REST_S, stageAt, START_S, STEP_S, WIDTH } from "./flow-layout";

// An animated flowchart on the brand's dark ink, explaining how one feature works. Nodes rise in column by
// column and connectors draw themselves; then on every run a light travels every connector, stage by stage,
// so no path is ever idle. The step the light has reached is ringed and read out in the caption bar.
// The travelling lights are native SVG animation; reduced motion gets the finished chart, still.
const ease = [0.23, 1, 0.32, 1];

// keyTimes must be strictly increasing, so each connector's window is nudged open by a hair.
const windowTimes = (k, steps) => {
  const cycle = steps * STEP_S + REST_S;
  return { cycle, a: Math.max((k * STEP_S) / cycle, 0.0001), b: ((k + 1) * STEP_S) / cycle };
};

function useCurrentStage(steps, reduce) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (reduce) return undefined;
    const start = performance.now();
    const t = setInterval(() => setStage(stageAt((performance.now() - start) / 1000, steps)), 100);
    return () => clearInterval(t);
  }, [steps, reduce]);
  return stage;
}

function Node({ n, id, reduce, current }) {
  const Icon = n.icon;
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, transform: "translateY(10px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.45, ease, delay: 0.1 + n.stage * 0.12 }}
    >
      <rect x={n.x - n.w / 2 - 4} y={n.y - n.h / 2 - 4} width={n.w + 8} height={n.h + 8} rx={22} fill="#0047FF" opacity={0.16} filter={`url(#${id}-blur)`} />
      <rect x={n.x - n.w / 2} y={n.y - n.h / 2} width={n.w} height={n.h} rx={18} fill="#130B3E" stroke={`url(#${id}-stroke)`} strokeWidth={1.6} />
      {/* The step the light is on: a bright ring that fades between steps */}
      <motion.rect
        x={n.x - n.w / 2 - 5}
        y={n.y - n.h / 2 - 5}
        width={n.w + 10}
        height={n.h + 10}
        rx={22}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={2}
        initial={false}
        animate={{ opacity: current ? 0.9 : 0 }}
        transition={{ duration: 0.25 }}
      />
      <rect x={n.x - 19} y={n.y - n.h / 2 + 12} width={38} height={38} rx={12} fill={`url(#${id}-${n.stage === 0 ? "start" : "chip"})`} />
      {Icon && <Icon x={n.x - 10} y={n.y - n.h / 2 + 21} width={20} height={20} color="#FFFFFF" strokeWidth={2} />}
      <text x={n.x} y={n.y + 18} textAnchor="middle" fontSize={19} fontWeight={600} fill="#FFFFFF">
        {n.label}
      </text>
      {n.sub && (
        <text x={n.x} y={n.y + 39} textAnchor="middle" fontSize={14.5} fill="#A9B3CC">
          {n.sub}
        </text>
      )}
    </motion.g>
  );
}

export default function FlowChart({ stages, title, label = "How it works", className = "" }) {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const { nodes, edges, steps } = layoutFlow(stages);
  const current = useCurrentStage(steps, reduce);
  const caption = nodes.filter((n) => n.stage === current);

  return (
    <div className={`relative isolate flex flex-col overflow-hidden rounded-[28px] bg-[#0A0626] ${className}`}>
      {/* Faint dot grid and soft logo-coloured light behind the chart */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]" />
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#2300DC]/40 blur-[90px]" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#00B8FF]/20 blur-[90px]" />
      </div>

      <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#00B8FF]">{label}</p>
          <p className="mt-1 text-lg font-medium text-white">{title}</p>
        </div>
        <span className="mt-1 flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A9B3CC]">
          <span className="h-2 w-2 rounded-full bg-[#00B8FF] shadow-[0_0_10px_#00B8FF] motion-safe:animate-pulse" />
          Live
        </span>
      </div>

      {/* Below the chart's natural width it scrolls sideways instead of shrinking the text */}
      <div className="flex flex-1 items-center overflow-x-auto px-2 pb-2">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`${title}: ${stages.map((s) => s.map((n) => n.label).join(" and ")).join(", then ")}`}
          className="h-auto w-full min-w-[520px]"
        >
          <defs>
            <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2={WIDTH} y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#00B8FF" />
              <stop offset="1" stopColor="#0047FF" />
            </linearGradient>
            <linearGradient id={`${id}-chip`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00B8FF" />
              <stop offset="1" stopColor="#0047FF" />
            </linearGradient>
            <linearGradient id={`${id}-start`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FF0000" />
              <stop offset="1" stopColor="#2300DC" />
            </linearGradient>
            <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>

          {edges.map((e, i) => (
            <g key={i}>
              <motion.path
                d={e.d}
                fill="none"
                stroke={`url(#${id}-stroke)`}
                strokeWidth={2.5}
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease, delay: 0.25 + e.stage * 0.12 }}
              />
              <circle cx={e.end[0]} cy={e.end[1]} r={4} fill="#00B8FF" />
            </g>
          ))}

          {nodes.map((n) => (
            <Node key={`${n.stage}-${n.label}`} n={n} id={id} reduce={reduce} current={!reduce && n.stage === current} />
          ))}

          {/* The lights: one per connector, each moving only during its own stage's slice of the cycle */}
          {!reduce &&
            edges.map((e, i) => {
              const { cycle, a, b } = windowTimes(e.stage, steps);
              const eps = 0.0001;
              return (
                <g key={`p${i}`} opacity="0">
                  <animate attributeName="opacity" dur={`${cycle}s`} repeatCount="indefinite" begin={`${START_S}s`} values="0;0;1;1;0;0" keyTimes={`0;${a};${a + eps};${b - eps};${b};1`} />
                  <animateMotion dur={`${cycle}s`} repeatCount="indefinite" begin={`${START_S}s`} path={e.d} keyPoints="0;0;1;1" keyTimes={`0;${a};${b};1`} calcMode="linear" />
                  <circle r={13} fill="#00B8FF" opacity={0.35} filter={`url(#${id}-blur)`} />
                  <circle r={5} fill="#FFFFFF" />
                </g>
              );
            })}
        </svg>
      </div>

      {/* Caption bar: which step the light is on, in words */}
      <div className="flex items-center gap-4 border-t border-white/10 px-5 py-4 sm:px-6">
        <div aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
          {stages.map((_, k) => (
            <span
              key={k}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${k === current ? "w-6 bg-[#00B8FF]" : k < current ? "w-1.5 bg-[#00B8FF]/50" : "w-1.5 bg-white/15"}`}
            />
          ))}
        </div>
        <p className="min-w-0 truncate text-sm text-[#A9B3CC]">
          <span className="mr-2 font-mono text-xs text-[#00B8FF]">
            Step {current + 1}/{stages.length}
          </span>
          <span className="font-medium text-white">{caption.map((n) => n.label).join(" · ")}</span>
          {caption.length === 1 && caption[0].sub && <span> — {caption[0].sub}</span>}
        </p>
      </div>
    </div>
  );
}
