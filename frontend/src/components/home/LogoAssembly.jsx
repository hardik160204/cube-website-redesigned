import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { cubicBezier, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { usePointerParallax } from "../../hooks/use-pointer-motion";
import { DIAMONDS, flight, INDIGO, OUTRO, RED, ROYAL, scatter, SKY, STEP, WORD_WINDOW } from "./logo-assembly";

// The homepage's brand moment. The logo mark is rebuilt from its 12 diamonds; they tumble in from deep space
// and lock into place as you scroll, while the footer tagline lights up word by word. Once built, the mark
// tilts toward the cursor and a glint runs down its rows. Scroll stays native: the scene is a sticky stage.
const OUT_EXPO = cubicBezier(0.23, 1, 0.32, 1);
const SIDE = Math.round((STEP * 1.64) / Math.SQRT2); // diamond square side: 82% of the lattice diagonal, like the logo's gaps
const TOP = STEP; // room above the red diamond's centre
const WORDS = [
  ["Smart.", SKY],
  ["Scalable.", ROYAL],
  ["Secure.", INDIGO],
  ["Cloud Telephony.", RED],
];

function Diamond({ d, i, progress }) {
  const s = scatter(i);
  const t = useTransform(progress, flight(i), [0, 1], { ease: OUT_EXPO });
  const style = {
    x: useTransform(t, [0, 1], [s.x, d.u * STEP]),
    y: useTransform(t, [0, 1], [s.y, d.v * STEP]),
    z: useTransform(t, [0, 1], [s.z, 0]),
    rotateX: useTransform(t, [0, 1], [s.rotateX, 0]),
    rotateY: useTransform(t, [0, 1], [s.rotateY, 0]),
    rotate: useTransform(t, [0, 1], [s.rotate, 0]),
    opacity: useTransform(t, [0, 0.35], [0, 1]),
    width: SIDE,
    height: SIDE,
    marginLeft: -SIDE / 2,
    marginTop: -SIDE / 2,
    top: TOP,
  };
  return (
    <motion.div style={style} className="absolute left-1/2 [transform-style:preserve-3d]">
      <div
        className="cl-glint h-full w-full rotate-45 rounded-[14px]"
        style={{
          background: `linear-gradient(135deg, rgb(255 255 255 / 0.3), transparent 55%), ${d.color}`,
          boxShadow: `0 18px 44px -14px ${d.color}, inset 0 1px 0 rgb(255 255 255 / 0.35)`,
          animationDelay: `${d.v * 0.14}s`,
        }}
      />
    </motion.div>
  );
}

function Word({ text, color, k, progress }) {
  const range = WORD_WINDOW(k);
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [18, 0]);
  return (
    <motion.span style={{ opacity, y }} className="flex items-center gap-4">
      <span className="h-3.5 w-3.5 shrink-0 rotate-45 rounded-[3px] md:h-4 md:w-4" style={{ background: color, boxShadow: `0 0 18px ${color}` }} />
      {text}
    </motion.span>
  );
}

export default function LogoAssembly() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const built = useMotionValue(1);
  // Reduced motion: the mark is simply there, assembled, and the section is ordinary height.
  const progress = reduce ? built : scrollYProgress;

  const pointer = usePointerParallax();
  const rotateX = useTransform(pointer.y, (v) => v * -18);
  const rotateY = useTransform(pointer.x, (v) => v * 26);

  const outroOpacity = useTransform(progress, OUTRO, [0, 1]);
  const outroY = useTransform(progress, OUTRO, [20, 0]);
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  return (
    <section ref={ref} aria-labelledby="cube-mark-title" className={`relative bg-[#0A0626] ${reduce ? "" : "h-[260vh]"}`}>
      <div {...pointer.handlers} className={`relative flex items-center overflow-hidden ${reduce ? "py-20" : "sticky top-0 h-screen"}`}>
        {/* The logo's own lattice, faintly, behind everything; then soft light in the logo's colours */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(-45deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(60%_70%_at_35%_55%,black,transparent)]" />
          <div className="absolute left-[8%] top-[18%] h-[420px] w-[420px] rounded-full bg-[#0047FF]/30 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[28%] h-[380px] w-[380px] rounded-full bg-[#2300DC]/40 blur-[120px]" />
          <div className="absolute right-[6%] top-[30%] h-[320px] w-[320px] rounded-full bg-[#00B8FF]/20 blur-[110px]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-[1228px] grid-cols-[minmax(0,1fr)] items-center gap-6 px-4 pb-10 pt-28 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          {/* The mark */}
          <div className="flex h-[230px] justify-center sm:h-[340px]">
            {/* Scale lives on a plain wrapper: Motion's inline tilt transform would override a Tailwind scale on the same element */}
            <div className="h-[340px] w-[440px] shrink-0 origin-top scale-[0.66] [perspective:1100px] sm:scale-100">
              <motion.div style={{ rotateX, rotateY }} className="relative h-full w-full [transform-style:preserve-3d]">
                {DIAMONDS.map((d, i) => (
                  <Diamond key={`${d.u},${d.v}`} d={d} i={i} progress={progress} />
                ))}
                <div aria-hidden="true" className="absolute left-1/2 top-[300px] h-10 w-[360px] -translate-x-1/2 rounded-[50%] bg-[#0047FF]/30 blur-2xl" />
              </motion.div>
            </div>
          </div>

          {/* The tagline, from the site footer */}
          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00B8FF] md:text-[13px]">35+ years of computer telephony</p>
            <h2 id="cube-mark-title" className="mt-5 text-[38px] font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-[52px] lg:text-[64px]">
              <span className="sr-only">Smart. Scalable. Secure Cloud Telephony.</span>
              <span aria-hidden="true" className="flex flex-col items-center gap-1 lg:items-start">
                {WORDS.map(([text, color], k) => (
                  <Word key={text} text={text} color={color} k={k} progress={progress} />
                ))}
              </span>
            </h2>
            <motion.div style={{ opacity: outroOpacity, y: outroY }} className="mt-8 flex flex-col items-center gap-5 lg:items-start">
              <p className="max-w-md text-lg leading-7 text-[#A9B3CC]">One platform, built in-house since 1990.</p>
              <Link
                to="/contact"
                className="group inline-flex h-12 items-center gap-2 rounded-lg bg-white px-7 font-semibold text-[#0047FF] transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-[#E6EEFF] motion-reduce:hover:scale-100"
              >
                Book a demo <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>
        </div>

        {!reduce && (
          <motion.p style={{ opacity: hintOpacity }} aria-hidden="true" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col whitespace-nowrap sm:flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-[#A9B3CC]">
            Scroll to build the cube
            <ChevronDown size={16} className="motion-safe:animate-bounce" />
          </motion.p>
        )}
      </div>
    </section>
  );
}
