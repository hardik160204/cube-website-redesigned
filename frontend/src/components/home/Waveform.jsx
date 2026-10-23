import React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { TRACKING_SPRING, useFinePointer } from "../../hooks/use-pointer-motion";
import { ease } from "../../lib/motion";
import { formatClock, waveHeights } from "./call-math";

const HEIGHTS = waveHeights(96);
// The illustrated call runs 04:13, so the playhead's clock spans 0–253s across the band.
const CALL_SECONDS = 253;
const MARKERS = [
  { at: 0.07, label: "Ring" },
  { at: 0.3, label: "IVR · pressed 2" },
  { at: 0.55, label: "Agent connected" },
  { at: 0.88, label: "Saved to Callisto" },
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * One bar. The outer span swells near the cursor (a Gaussian bump, scaled so it never
 * outgrows the band); the inner span breathes on its own CSS loop. Two layers, two owners.
 */
function Bar({ index, height, pointer, amp }) {
  const pos = index / (HEIGHTS.length - 1);
  const scaleY = useTransform([pointer, amp], ([p, a]) => 1 + (1 / height - 1) * 0.85 * a * Math.exp(-((pos - p) ** 2) / 0.003));

  return (
    <motion.span style={{ scaleY }} className="flex h-full min-w-0 flex-1 items-center max-sm:odd:hidden">
      <span
        className="block w-full rounded-full bg-foreground/80 motion-safe:animate-wave"
        style={{
          height: `${height * 100}%`,
          // Spread durations and phases so the bars never breathe in lockstep
          animationDuration: `${1.6 + ((index * 7) % 10) / 10}s`,
          animationDelay: `-${((index * 13) % 20) / 10}s`,
        }}
      />
    </motion.span>
  );
}

/**
 * The hero's signature: a call recording drawn as a waveform. It draws in left to right on load,
 * swells and shows a scrubbing playhead + timestamp under the cursor, and flattens into a line
 * as the hero scrolls away (`flatten`, a 0–1 MotionValue from the parent).
 */
export default function Waveform({ flatten }) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const raw = useMotionValue(-1);
  const pointer = useSpring(raw, TRACKING_SPRING);
  const amp = useSpring(0, TRACKING_SPRING);

  const playheadX = useTransform(pointer, (p) => `${clamp01(p) * 100}%`);
  const clock = useTransform(pointer, (p) => formatClock(clamp01(p) * CALL_SECONDS));

  const at = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return (e.clientX - rect.left) / rect.width;
  };
  const handlers =
    fine && !reduce
      ? {
          // Jump on enter so the bump appears under the cursor instead of sweeping in from the edge
          onPointerEnter: (e) => {
            raw.set(at(e));
            pointer.jump(at(e));
          },
          onPointerMove: (e) => {
            raw.set(at(e));
            amp.set(1);
          },
          onPointerLeave: () => amp.set(0),
        }
      : {};

  return (
    <div aria-hidden="true" className="relative mt-16 sm:mt-20">
      <motion.div
        {...handlers}
        // Negative top/bottom insets keep the playhead's label inside the reveal clip
        initial={reduce ? { opacity: 0 } : { clipPath: "inset(-48px 100% -48px 0)" }}
        animate={reduce ? { opacity: 1 } : { clipPath: "inset(-48px 0% -48px 0)" }}
        transition={{ duration: 1.4, ease, delay: 0.5 }}
        style={reduce ? undefined : { scaleY: flatten }}
        className="relative h-36 sm:h-48"
      >
        <div className="flex h-full items-center gap-[2px] px-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] sm:gap-1 sm:px-6">
          {HEIGHTS.map((h, i) => (
            <Bar key={i} index={i} height={h} pointer={pointer} amp={amp} />
          ))}
        </div>

        {/* Playhead: a full-width layer translated by a percentage of its own width = the band's width */}
        <motion.div style={{ x: playheadX, opacity: amp }} className="pointer-events-none absolute inset-y-0 left-0 w-full">
          <span className="absolute inset-y-0 left-0 w-px bg-primary" />
          <motion.span className="absolute -top-9 left-0 rounded-full bg-primary px-2 py-0.5 font-mono text-[11px] tabular-nums text-primary-foreground [translate:-50%_0]">
            {clock}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Timeline axis under the band: where this call went */}
      <div className="relative mx-4 mt-4 hidden h-8 sm:mx-6 sm:block">
        <div className="absolute inset-x-0 top-0 h-px bg-border" />
        {MARKERS.map((m, i) => (
          <motion.span
            key={m.label}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(6px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.5, ease, delay: 1.5 + i * 0.12 } }}
            style={{ left: `${m.at * 100}%` }}
            className="absolute top-0 flex flex-col items-center [translate:-50%_0]"
          >
            <span className="h-2 w-px bg-foreground/40" />
            <span className="mt-1.5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{m.label}</span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}
