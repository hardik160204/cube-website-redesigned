import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "../../hooks/use-media-query";
import { ease, inView, reveal } from "../../lib/motion";
import { formatClock, stageAt, stageProgress } from "./call-math";
import SectionIntro from "./SectionIntro";
import { BillVisual, DialVisual, IvrVisual, RecordVisual, RouteVisual, TalkVisual } from "./journey-visuals";

const STAGES = [
  {
    title: "Dial",
    product: "Auto Dialer",
    href: "/services/auto-dialer",
    desc: "Predictive, progressive and preview dialing keeps agents talking instead of waiting.",
    Visual: DialVisual,
  },
  {
    title: "Greet",
    product: "IVRS",
    href: "/services/ivrs",
    desc: "Custom IVR flows answer, qualify and steer every caller from the first ring.",
    Visual: IvrVisual,
  },
  {
    title: "Route",
    product: "Smart Call Routing",
    href: "/services/smart-call-routing",
    desc: "Skill, language and time-based rules send each call to the right agent.",
    Visual: RouteVisual,
  },
  {
    title: "Talk",
    product: "Cloud Contact Center",
    href: "/services/cloud-contact-center",
    desc: "Agents and supervisors work from one live console, from the floor or from home.",
    Visual: TalkVisual,
  },
  {
    title: "Record",
    product: "Callisto Voice Logger",
    href: "/services/voice-logger",
    desc: "Every conversation captured, compressed and searchable — with the screen beside it.",
    Visual: RecordVisual,
  },
  {
    title: "Bill",
    product: "Call Billing",
    href: "/services/call-billing",
    desc: "Each call's cost lands on the right department, branch and monthly report.",
    Visual: BillVisual,
  },
];

const INTRO = {
  label: "The life of a call",
  title: "Six handoffs. One platform.",
  body: "Follow one customer call through Cube. Every step runs on software we build ourselves.",
};

// Call clock at each stage boundary: rings for 4s, IVR until 0:19, connects at 0:23, talks until 4:08.
// Scrolling through "Talk" makes the clock race, which is what a real call feels like.
const BOUNDS = STAGES.map((_, i) => i / STAGES.length).concat(1);
const SECONDS = [0, 4, 19, 23, 248, 252, 253];

// Blur bridges the crossfade so two stage UIs never read as overlapping objects (Emil Kowalski).
const swap = (reduce) => ({
  initial: reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)", transform: "translateY(14px)" },
  animate: reduce
    ? { opacity: 1, transition: { duration: 0.2 } }
    : { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)", transition: { duration: 0.35, ease } },
  exit: reduce
    ? { opacity: 0, transition: { duration: 0.12 } }
    : { opacity: 0, filter: "blur(6px)", transform: "translateY(-10px)", transition: { duration: 0.18, ease } },
});

function CanvasChrome({ index, children }) {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">call_0441 · live</span>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}
        </span>
      </div>
      {children}
    </div>
  );
}

function StageFooter({ stage }) {
  return (
    <div className="flex items-end justify-between gap-6 border-t border-white/[0.07] px-6 py-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-blue-400">{stage.product}</p>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-foreground/85">{stage.desc}</p>
      </div>
      <Link
        to={stage.href}
        className="group inline-flex shrink-0 items-center gap-1.5 rounded-full text-sm font-semibold text-foreground transition-colors hover:text-blue-300"
      >
        Explore
        <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

// Desktop: the section is tall and its content sticks; scroll position picks the stage and runs the clock.
function PinnedJourney() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(stageAt(v, STAGES.length)));

  const clock = useTransform(useTransform(scrollYProgress, BOUNDS, SECONDS), formatClock);
  const local = useTransform(scrollYProgress, (v) => stageProgress(v, STAGES.length));
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -160]);

  // Clicking a stage scrolls to the middle of its segment (CSS decides smooth vs. instant).
  const jumpTo = (i) => {
    const el = ref.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / STAGES.length) });
  };

  const stage = STAGES[active];
  const { Visual } = stage;
  const transition = swap(reduce);

  return (
    <section id="journey" ref={ref} className="dark relative bg-background text-foreground" style={{ height: `${STAGES.length * 75 + 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.div
            style={reduce ? undefined : { y: gridY }}
            className="absolute inset-x-0 -bottom-48 -top-48 bg-[linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_70%_at_60%_50%,black,transparent)]"
          />
          <div className="absolute right-[6%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-primary/20 blur-[140px]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-16 px-6 pt-16">
          <div>
            <SectionIntro {...INTRO} />

            <ol className="relative mt-10">
              {/* Rail fills with scroll progress */}
              <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-px bg-white/10" />
              <motion.span
                aria-hidden="true"
                style={{ scaleY: scrollYProgress }}
                className="absolute bottom-3 left-[11px] top-3 w-px origin-top bg-primary"
              />
              {STAGES.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={i === active ? "step" : undefined}
                    className="group relative flex w-full items-center gap-4 rounded-xl py-2.5 pr-3 text-left"
                  >
                    {i === active && (
                      <motion.span
                        layoutId="journey-active"
                        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                        className="absolute -inset-y-0.5 -left-3 right-0 rounded-xl bg-white/[0.05]"
                      />
                    )}
                    <span
                      className={`relative flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full border font-mono text-[10px] transition-colors duration-200 ${
                        i <= active ? "border-primary bg-primary text-primary-foreground" : "border-white/20 bg-background text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`relative font-heading text-lg font-semibold transition-colors duration-200 ${
                        i === active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="relative ml-auto font-mono text-xs text-muted-foreground">{s.product}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex items-baseline gap-3">
              <motion.span className="font-mono text-4xl tabular-nums text-foreground">{clock}</motion.span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Call duration</span>
            </div>
          </div>

          <CanvasChrome index={active}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={stage.title} {...transition}>
                <div className="h-[400px] p-6">
                  <Visual clock={clock} progress={local} />
                </div>
                <StageFooter stage={stage} />
              </motion.div>
            </AnimatePresence>
          </CanvasChrome>
        </div>
      </div>
    </section>
  );
}

// Below lg: a plain vertical story, each stage with its own visual. No pinning on small screens.
function StackedJourney() {
  const reduce = useReducedMotion();
  const done = useMotionValue(1);
  const fullClock = useMotionValue(formatClock(253));
  const item = reveal(reduce, "translateY(32px)", "translateY(0px)");

  return (
    <section id="journey" className="dark relative scroll-mt-20 bg-background py-24 text-foreground">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <SectionIntro {...INTRO} />
        <ol className="mt-14 space-y-14">
          {STAGES.map(({ Visual, ...s }, i) => (
            <motion.li key={s.title} {...inView} variants={item}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-blue-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-heading text-2xl font-semibold">{s.title}</h3>
              </div>
              <div className="mt-4">
                <CanvasChrome index={i}>
                  <div className="h-[380px] p-5">
                    <Visual clock={fullClock} progress={done} />
                  </div>
                  <StageFooter stage={s} />
                </CanvasChrome>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function CallJourney() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop ? <PinnedJourney /> : <StackedJourney />;
}
