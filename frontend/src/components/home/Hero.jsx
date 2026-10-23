import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { MagneticLink } from "../ui/magnetic-link";
import { RevealText } from "../ui/reveal-text";
import { ease, fadeUp, inView, reveal } from "../../lib/motion";
import Waveform from "./Waveform";

const STATS = [
  { value: "35+", label: "Years in telephony" },
  { value: "5,000+", label: "Active users" },
  { value: "10+", label: "Countries" },
  { value: "99.5%", label: "Uptime SLA" },
];

// Apple-style springs from Emil Kowalski's tables; the CTA takes the top of the 0.1–0.3 bounce range.
const LINE_SPRING = { type: "spring", duration: 0.9, bounce: 0.2 };
const CTA_SPRING = { type: "spring", duration: 0.5, bounce: 0.3 };

// Orchestration: label → line 1 → line 2 → actions, 100ms apart. The waveform draws in under it all.
const sequence = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const lineStagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

// A drawn "signal" under the payoff words; revealed with a clip so the stroke stays even at any width.
function SignalUnderline({ children }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-block">
      {children}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 300 20"
        preserveAspectRatio="none"
        initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }}
        animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 1, ease, delay: 1 }}
        className="absolute -bottom-[0.06em] left-0 h-[0.16em] w-full overflow-visible text-primary"
      >
        <path
          d="M2 10 C 20 2, 30 18, 48 10 S 76 2, 94 10 S 122 18, 140 10 S 168 2, 186 10 S 214 18, 232 10 S 260 2, 278 10 L 298 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>
    </span>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();

  // Scroll-linked exit: copy sinks slower than the page, the grid slower still, and the
  // waveform flattens into a single line that hands off to the journey section below.
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const flatten = useTransform(scrollYProgress, [0, 0.85], [1, 0.08]);
  const drift = (style) => (reduce ? undefined : style);

  // Full transform strings so Motion can hardware-accelerate the reveal while the page loads.
  const line = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(50px)" },
    show: reduce
      ? { opacity: 1, transition: { duration: 0.4, ease } }
      : { opacity: 1, transform: "translateY(0px)", transition: LINE_SPRING },
  };
  const ctaPop = {
    hidden: { opacity: 0, scale: reduce ? 1 : 0.9 },
    show: { opacity: 1, scale: 1, transition: CTA_SPRING },
  };
  const stat = reveal(reduce, "translateY(16px)", "translateY(0px)", 0.07);

  return (
    <section ref={ref} className="relative isolate overflow-hidden pb-16 pt-36 sm:pt-44">
      {/* Faint grid: pans forward on its own (CSS) and sinks slower than the page on scroll (Motion) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_65%_at_30%_0%,black,transparent)]">
        <motion.div style={drift({ y: gridY })} className="absolute inset-x-0 -top-56 bottom-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(15_23_42/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(15_23_42/0.05)_1px,transparent_1px)] bg-[size:56px_56px] motion-safe:animate-grid-pan" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div variants={sequence} initial="hidden" animate="show" style={drift({ y: copyY })}>
          <motion.p variants={fadeUp} className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span aria-hidden="true" className="h-px w-8 bg-foreground/30" />
            Computer telephony since 1990
          </motion.p>

          <motion.h1
            variants={lineStagger}
            className="mt-8 font-heading text-[clamp(2.75rem,7.4vw,7.25rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-foreground"
          >
            {/* One mask per line; the padding keeps descenders and the underline inside it */}
            <span className="-mb-[0.18em] block overflow-hidden pb-[0.18em]">
              <motion.span variants={line} className="inline-block">
                From first ring
              </motion.span>
            </span>
            <span className="-mb-[0.18em] block overflow-hidden pb-[0.18em]">
              <motion.span variants={line} className="inline-block">
                to <SignalUnderline>final invoice.</SignalUnderline>
              </motion.span>
            </span>
          </motion.h1>

          <div className="mt-10 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
            <RevealText
              as="p"
              delay={0.45}
              className="block max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
              text="Dialing, IVR, routing, recording and billing — the whole life of a business call on one platform, built in-house for 35 years."
            />
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <MagneticLink
                to="/contact"
                variants={ctaPop}
                className="h-12 rounded-full px-7 text-[15px] shadow-glow hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.5),0_14px_40px_-10px_hsl(var(--primary)/0.75)]"
              >
                Book a demo <ArrowRight />
              </MagneticLink>
              <MagneticLink
                to="#journey"
                variant="outline"
                className="h-12 rounded-full bg-card px-6 text-[15px] text-foreground shadow-card hover:bg-card hover:text-foreground hover:shadow-elevated"
              >
                Follow a call <ArrowDown />
              </MagneticLink>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Waveform flatten={flatten} />

      <motion.dl {...inView} className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-y-8 px-4 sm:px-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} variants={stat} custom={i} className="border-l border-border pl-5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</dt>
            <dd className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{s.value}</dd>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  );
}
