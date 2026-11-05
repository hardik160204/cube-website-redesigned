import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { X } from "lucide-react";
import { RIDERS, Diya, Pichkari } from "./art";
import { THEMES } from "./themes";
import "./festival.css";

// Dresses the whole site for a festival: its colours (festival.css follows the variables set here), a garland
// under the header, a light drift of sparks, petals or snow, a greeting, and something that travels with the
// visitor's scrolling. Everything is decoration: nothing here can be clicked except the greeting's close button,
// and nothing moves for visitors who ask for reduced motion.

const LAMPS = 9;

function useScrollMotion() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return reduce ? scrollYProgress : spring;
}

// Down (or up) a golden thread at the page's edge, lighting little lamps as it passes them.
function Rail({ theme }) {
  const p = useScrollMotion();
  const y = useTransform(p, [0, 1], theme.up ? ["100%", "0%"] : ["0%", "100%"]);
  const fill = useTransform(p, [0, 1], [0, 1]);
  const flame = useTransform(p, [0, 1], [0.8, 1.35]);
  const [lit, setLit] = useState(0);
  useMotionValueEvent(p, "change", (v) => setLit(Math.round(v * LAMPS)));
  const Rider = RIDERS[theme.rider];
  return (
    <div className="f-rail">
      <span className="f-thread" />
      <motion.span className={`f-thread-lit ${theme.up ? "f-from-bottom" : ""}`} style={{ scaleY: fill }} />
      {Array.from({ length: LAMPS }, (_, i) => {
        const at = (i + 1) / (LAMPS + 1);
        return <span key={i} className={`f-lamp ${lit > i ? "f-lamp-on" : ""}`} style={{ top: `${(theme.up ? 1 - at : at) * 100}%` }} />;
      })}
      <motion.div className="f-rider-track" style={{ y }}>
        <div className="f-rider">{theme.rider === "diya" ? <Diya flame={flame} /> : <Rider />}</div>
      </motion.div>
    </div>
  );
}

// Colour splashes kept mounted and replayed in turn, so a splash never changes the page's structure.
const SPLATS = 8;
function useSplashes(colors) {
  const refs = useRef([]);
  const next = useRef(0);
  const splash = () => {
    const el = refs.current[next.current++ % SPLATS];
    if (!el) return;
    const left = Math.random() < 0.5 ? 2 + Math.random() * 18 : 80 + Math.random() * 16;
    el.style.left = `${left}vw`;
    el.style.top = `${14 + Math.random() * 68}vh`;
    el.style.color = colors[next.current % colors.length];
    const rotate = `${Math.random() * 360}deg`;
    el.animate(
      [
        { opacity: 0, transform: `rotate(${rotate}) scale(0.2)` },
        { opacity: 0.55, transform: `rotate(${rotate}) scale(1)`, offset: 0.14 },
        { opacity: 0, transform: `rotate(${rotate}) scale(1.08)` },
      ],
      { duration: 1900, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
    );
  };
  const nodes = Array.from({ length: SPLATS }, (_, i) => (
    <svg key={i} ref={(n) => (refs.current[i] = n)} className="f-splat" viewBox="-70 -70 140 140" aria-hidden="true">
      <path fill="currentColor" d="M0-48C20-58 34-34 52-34 70-34 74-10 60 2 72 22 58 44 36 38 24 62-10 60-18 40-42 48-62 28-48 8-66-10-50-36-28-30-22-44-12-44 0-48Z" />
      <circle cx="58" cy="-44" r="6" fill="currentColor" />
      <circle cx="-58" cy="46" r="5" fill="currentColor" />
      <circle cx="30" cy="58" r="4" fill="currentColor" />
    </svg>
  ));
  return { splash, nodes };
}

// Along the top of the page: a coloured stream behind, spraying ahead while the visitor scrolls, and now and
// then a splash of colour lands at the side of the page.
function TopRide({ theme }) {
  const reduce = useReducedMotion();
  const p = useScrollMotion();
  const x = useTransform(p, [0, 1], ["0%", "100%"]);
  const stream = useTransform(p, [0, 1], [0, 1]);
  const flame = useTransform(p, [0, 1], [0.8, 1.35]);
  const [firing, setFiring] = useState(false);
  const stop = useRef();
  const lastStep = useRef(0);
  const { splash, nodes } = useSplashes(theme.swatch);
  useMotionValueEvent(p, "change", (v) => {
    setFiring(true);
    clearTimeout(stop.current);
    stop.current = setTimeout(() => setFiring(false), 220);
    const step = Math.floor(v * 10);
    if (step !== lastStep.current && !reduce && theme.rider === "pichkari") {
      lastStep.current = step;
      splash();
    }
  });
  useEffect(() => () => clearTimeout(stop.current), []);
  const Rider = RIDERS[theme.rider];
  return (
    <>
      <div className="f-top">
        <motion.span className="f-stream" style={{ scaleX: stream, backgroundImage: `linear-gradient(90deg, ${theme.swatch.join(",")})` }} />
        <motion.div className="f-top-track" style={{ x }}>
          <div className={`f-top-rider ${theme.rider === "pichkari" ? "f-top-pichkari" : ""}`}>
            {theme.rider === "pichkari" ? (
              <>
                <Pichkari firing={firing} />
                <span className={`f-spray ${firing ? "f-spray-on" : ""}`}>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <i key={i} style={{ background: theme.swatch[i % theme.swatch.length], animationDelay: `${i * 70}ms` }} />
                  ))}
                </span>
              </>
            ) : theme.rider === "diya" ? (
              <Diya flame={flame} />
            ) : (
              <Rider />
            )}
          </div>
        </motion.div>
      </div>
      {nodes}
    </>
  );
}

// The light drift across the page: a fixed, small number of pieces, seeded so they don't jump between renders.
function Particles({ kind, theme }) {
  const pieces = useMemo(() => {
    const colors = [theme.accent, theme.accent2, theme.accent3, ...theme.swatch];
    return Array.from({ length: kind === "gulal" ? 12 : 18 }, (_, i) => {
      const seed = (i * 97 + 13) % 100;
      return {
        left: `${(i * 37 + 7) % 100}%`,
        delay: `${-((seed / 100) * 18).toFixed(1)}s`,
        duration: `${12 + (seed % 9)}s`,
        size: `${(kind === "gulal" ? 60 : kind === "kite" ? 16 : 6) + (seed % 6) * (kind === "gulal" ? 16 : 1.6)}px`,
        color: colors[i % colors.length],
      };
    });
  }, [kind, theme]);
  return (
    <div className={`f-particles f-${kind}`}>
      {pieces.map((s, i) => (
        <i key={i} style={{ left: s.left, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.duration, "--c": s.color }} />
      ))}
    </div>
  );
}

// A few fireworks, only while the visitor is at the top of the page.
function Fireworks({ theme }) {
  const colors = [theme.accent, theme.accent2, theme.accent3];
  return (
    <div className="f-fireworks">
      {[
        { left: "8%", top: "30%", delay: "0s" },
        { left: "91%", top: "52%", delay: "2.6s" },
        { left: "17%", top: "58%", delay: "5.200s" },
      ].map((b, k) => (
        <span key={k} className="f-burst" style={{ left: b.left, top: b.top, "--d": b.delay }}>
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} style={{ "--a": `${i * 30}deg`, background: colors[(i + k) % colors.length] }} />
          ))}
        </span>
      ))}
    </div>
  );
}

function Greeting({ festival, Art }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(`cube_greeted_${festival.key}`) === "1";
      sessionStorage.setItem(`cube_greeted_${festival.key}`, "1");
    } catch {
      /* storage blocked: greet anyway */
    }
    if (seen) return undefined;
    const show = setTimeout(() => setOpen(true), 900);
    const hide = setTimeout(() => setOpen(false), 900 + 60000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [festival.key]);
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(-10px) scale(0.96)" }}
      animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="f-greeting"
      role="status"
    >
      <span className="f-greeting-art">{Art}</span>
      <p>{festival.greeting}</p>
      <button type="button" aria-label="Close greeting" onClick={() => setOpen(false)}>
        <X size={15} />
      </button>
    </motion.div>
  );
}

export default function Festival({ festival }) {
  const theme = THEMES[festival.key];
  const reduce = useReducedMotion();
  const [atTop, setAtTop] = useState(true);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setAtTop(v < 240));

  // Colours are variables on the page root; festival.css does the rest.
  useEffect(() => {
    const root = document.documentElement;
    const vars = {
      "--primary": theme.primary,
      "--f-primary": theme.primary,
      "--f-primary-hex": theme.primaryHex,
      "--f-hover": theme.hover,
      "--f-ink": theme.ink,
      "--f-accent": theme.accent,
      "--f-accent2": theme.accent2,
      "--f-accent3": theme.accent3,
      "--f-tint": theme.tint,
      "--f-foot": theme.foot,
      "--f-hue": theme.hue,
      "--f-grad": theme.grad,
      "--f-motif": theme.motif,
      "--f-garland": theme.garland,
      "--f-garland-h": `${theme.garlandHeight}px`,
    };
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
    root.setAttribute("data-festival", festival.key);
    return () => {
      for (const k of Object.keys(vars)) root.style.removeProperty(k);
      root.removeAttribute("data-festival");
    };
  }, [festival.key, theme]);

  const Rider = RIDERS[theme.rider];
  const art = theme.rider === "diya" ? <Diya /> : theme.rider === "pichkari" ? <Pichkari /> : <Rider />;

  return (
    <>
    {festival.effects && !reduce && (
      <div data-cube-ui="" aria-hidden="true">
        <Particles kind={theme.particles} theme={theme} />
      </div>
    )}
    <div data-cube-ui="" className={`f-layer ${atTop ? "f-at-top" : ""}`}>
      <div className="f-garland" aria-hidden="true" />
      {festival.effects && !reduce && theme.burst && <Fireworks theme={theme} />}
      {festival.scroll && (
        <div aria-hidden="true">
          {!theme.top && <div className="f-only-wide"><Rail theme={theme} /></div>}
          <div className={theme.top ? "" : "f-only-narrow"}>
            <TopRide theme={theme} />
          </div>
        </div>
      )}
      {festival.popup && <Greeting festival={festival} Art={art} />}
    </div>
    </>
  );
}
