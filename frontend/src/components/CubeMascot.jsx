import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, MessageCircle, Phone, X } from "lucide-react";
import { CONTACT, tel } from "./home/catalog";
import { openDemo } from "./demo";

// Cube, the site's mascot: a small cube in the logo's colours with a screen for a face. Its eyes follow the
// pointer, it blinks, smiles when you come near and floats with the logo's red diamond on its antenna.
// Clicking it opens a quick menu (chat, demo, call). Reduced motion keeps it still and the eyes centred.
const ease = [0.23, 1, 0.32, 1];

const greeting = (path) => {
  if (path.includes("pricing")) return "Need a custom Enterprise quote?";
  if (path.includes("services")) return "Want to see how our Cloud Contact Center works?";
  if (path.includes("industries")) return "Want to see Cube working in your industry?";
  return "We're Online! How may I help you today?";
};

function Bot({ look, happy, blink }) {
  return (
    <svg viewBox="0 0 120 132" aria-hidden="true" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="cm-top" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7FD8FF" />
          <stop offset="1" stopColor="#00B8FF" />
        </linearGradient>
        <linearGradient id="cm-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E6BFF" />
          <stop offset="1" stopColor="#0047FF" />
        </linearGradient>
        <linearGradient id="cm-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A1BF0" />
          <stop offset="1" stopColor="#2300DC" />
        </linearGradient>
        <filter id="cm-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      {/* Antenna with the logo's red diamond */}
      <line x1="56" y1="22" x2="56" y2="8" stroke="#0A0626" strokeWidth="3" strokeLinecap="round" />
      <rect x="51" y="-1" width="10" height="10" rx="2" transform="rotate(45 56 4)" fill="#FF0000" filter="url(#cm-glow)" className="cm-pulse" />
      <rect x="51" y="-1" width="10" height="10" rx="2" transform="rotate(45 56 4)" fill="#FF3B3B" />

      {/* The cube: top, side and front faces */}
      <path d="M22 36 L80 36 L100 20 L42 20 Z" fill="url(#cm-top)" />
      <path d="M80 36 L100 20 L100 82 L80 98 Z" fill="url(#cm-side)" />
      <rect x="22" y="36" width="58" height="62" rx="9" fill="url(#cm-front)" />
      <rect x="22" y="36" width="58" height="62" rx="9" fill="none" stroke="rgb(255 255 255 / 0.25)" />

      {/* Screen face */}
      <rect x="29" y="44" width="44" height="38" rx="9" fill="#0A0626" />
      <rect x="29" y="44" width="44" height="38" rx="9" fill="none" stroke="#00B8FF" strokeOpacity="0.35" />
      <g transform={`translate(${look.x} ${look.y})`}>
        {happy ? (
          <g stroke="#00B8FF" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#cm-glow)">
            <path d="M38 62 Q42 56 46 62" />
            <path d="M56 62 Q60 56 64 62" />
          </g>
        ) : (
          <g style={{ transform: `scaleY(${blink ? 0.1 : 1})`, transformOrigin: "51px 60px", transition: "transform 90ms ease-out" }}>
            <rect x="38" y="54" width="8" height="12" rx="4" fill="#00B8FF" filter="url(#cm-glow)" />
            <rect x="56" y="54" width="8" height="12" rx="4" fill="#00B8FF" filter="url(#cm-glow)" />
            <rect x="38" y="54" width="8" height="12" rx="4" fill="#BDEBFF" />
            <rect x="56" y="54" width="8" height="12" rx="4" fill="#BDEBFF" />
          </g>
        )}
        <path d={happy ? "M45 71 Q51 77 57 71" : "M46 72 Q51 75 56 72"} stroke="#00B8FF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>

      {/* Little arms */}
      <rect x="12" y="66" width="10" height="16" rx="5" fill="#0047FF" />
      <g className={happy ? "cm-wave" : ""} style={{ transformOrigin: "100px 74px" }}>
        <rect x="100" y="62" width="10" height="16" rx="5" fill="#2300DC" />
      </g>
    </svg>
  );
}

export default function CubeMascot() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [hover, setHover] = useState(false);
  const [hint, setHint] = useState(false);
  const [open, setOpen] = useState(false);

  // Eyes follow the pointer, a few pixels at most.
  useEffect(() => {
    if (reduce) return undefined;
    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(d / 300, 1);
        setLook({ x: (dx / d) * 4 * k, y: (dy / d) * 3 * k });
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduce]);

  // Blinks every few seconds.
  useEffect(() => {
    if (reduce) return undefined;
    let t;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        loop();
      }, 2800 + Math.random() * 2600);
    };
    loop();
    return () => clearTimeout(t);
  }, [reduce]);

  // Says hello once on each page, then goes quiet.
  useEffect(() => {
    setOpen(false);
    const show = setTimeout(() => setHint(true), 2500);
    const hide = setTimeout(() => setHint(false), 8000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      setHint(false);
    };
  }, [pathname]);

  // Escape or a click elsewhere closes the menu.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // The chat widget is not on every page; offer chat only where it is.
  const chatButton = () => document.querySelector(".chat-widget-trigger-button-class");
  const actions = [
    chatButton() && { icon: MessageCircle, label: "Chat with us", onClick: () => chatButton()?.click() },
    { icon: CalendarCheck, label: "Book a demo", onClick: openDemo },
    { icon: Phone, label: "Talk to an expert", href: tel(CONTACT.expert), sub: CONTACT.expert },
  ].filter(Boolean);

  const bubble = open ? null : hover || hint ? greeting(pathname) : null;

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, transform: "translateY(60px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.7, ease, delay: 1.2 }}
      className="fixed bottom-12 right-5 z-[9998] flex flex-col items-end"
    >
      <AnimatePresence>
        {bubble && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, transform: "translateY(8px) scale(0.96)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(6px) scale(0.96)" }}
            transition={{ duration: 0.2, ease }}
            className="relative mb-3 w-56 rounded-2xl rounded-br-md border border-[#E5EAF4] bg-white px-4 py-3 text-[14px] font-medium leading-snug text-[#0A0626] shadow-[0_20px_40px_-20px_rgb(10_6_38/0.45)]"
          >
            <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" /> Cube · Online
            </span>
            {bubble}
          </motion.div>
        )}
        {open && (
          <motion.div
            key="menu"
            role="menu"
            initial={{ opacity: 0, transform: "translateY(10px) scale(0.96)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(8px) scale(0.96)" }}
            transition={{ duration: 0.22, ease }}
            className="mb-3 w-64 origin-bottom-right overflow-hidden rounded-2xl border border-white/10 bg-[#0A0626] p-2 text-white shadow-[0_30px_60px_-20px_rgb(10_6_38/0.8)]"
          >
            <div className="flex items-center justify-between px-3 pb-2 pt-1.5">
              <span className="text-sm font-medium">Hi, I'm Cube 👋</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-md p-1 text-[#A9B3CC] hover:bg-white/10 hover:text-white">
                <X size={16} />
              </button>
            </div>
            {actions.map(({ icon: Icon, label, onClick, href, sub }) => {
              const inner = (
                <>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary">
                    <Icon size={16} />
                  </span>
                  <span className="flex flex-col text-left">
                    <span className="text-[14px] font-medium">{label}</span>
                    {sub && <span className="text-xs text-[#A9B3CC]">{sub}</span>}
                  </span>
                </>
              );
              const cls = "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/10";
              return href ? (
                <a key={label} role="menuitem" href={href} className={cls}>
                  {inner}
                </a>
              ) : (
                <button
                  key={label}
                  role="menuitem"
                  type="button"
                  className={cls}
                  onClick={() => {
                    setOpen(false);
                    onClick();
                  }}
                >
                  {inner}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Open Cube assistant"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="group relative h-[110px] w-[100px] outline-none transition-transform duration-300 ease-out-expo hover:-rotate-3 hover:scale-105 focus-visible:scale-105 active:scale-95"
      >
        <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-3 rounded-full bg-[#0A0626]/25 blur-[4px] cm-shadow" />
        <span aria-hidden="true" className="absolute inset-2 rounded-full bg-[#0047FF]/25 blur-2xl" />
        <span className="cm-float absolute inset-x-0 top-0 block h-[100px]">
          <Bot look={look} happy={hover || open} blink={blink} />
        </span>
      </button>
    </motion.div>
  );
}
