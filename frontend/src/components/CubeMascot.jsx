import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, ChevronLeft, ChevronRight, PencilLine, X } from "lucide-react";
import { ICONS, editing } from "../lib/editable";
import { navIcon } from "../lib/nav";
import { useSiteData } from "../lib/site";
import { openDemo } from "./demo";

// Cube, the site's mascot: a small cube in the logo's colours with a screen for a face. Its eyes follow the
// pointer, it blinks, smiles when you come near and floats with the logo's red diamond on its antenna.
// Clicking it opens its panel: buttons and answers to common questions, all set in the dashboard's "Chat bot"
// page. Reduced motion keeps it still and the eyes centred.
const ease = [0.23, 1, 0.32, 1];

ICONS.set("CalendarCheck", CalendarCheck);

const greeting = (path, bubbles) => {
  if (path.includes("pricing")) return bubbles.pricing;
  if (path.includes("services")) return bubbles.services;
  if (path.includes("industries")) return bubbles.industries;
  return bubbles.default;
};

// One button in the panel: the demo booking, a page on this site, or any other link.
function BotAction({ action, navigate, close }) {
  const Icon = navIcon(action.icon);
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#00B8FF,#0047FF)] text-white shadow-[0_8px_16px_-8px_rgb(0_71_255/0.8)] transition-transform duration-200 ease-out-expo group-hover:scale-105">
        <Icon size={17} />
      </span>
      <span className="mt-2 block text-[13.5px] font-semibold leading-tight text-[#0A0626]">{action.label}</span>
      {action.sub && <span className="mt-0.5 block truncate text-[12px] text-[#6B6E75]">{action.sub}</span>}
    </>
  );
  const cls = "group block h-full w-full rounded-2xl border border-[#E5EAF4] bg-white p-3 text-left transition-colors hover:border-[#99B5FF] hover:bg-[#F5F8FF]";
  const { href } = action;
  if (href === "demo:" || href.startsWith("/")) {
    return (
      <button
        type="button"
        className={cls}
        onClick={() => {
          close();
          if (href === "demo:") openDemo();
          else navigate(href);
        }}
      >
        {inner}
      </button>
    );
  }
  return (
    <a href={href} className={cls} onClick={close} {...(href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  );
}

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
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { bot } = useSiteData();
  const ref = useRef(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [hover, setHover] = useState(false);
  const [hint, setHint] = useState(false);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(null); // the question being read

  // Eyes follow the pointer, a few pixels at most.
  useEffect(() => {
    if (reduce) return undefined;
    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.right - 50);
        const dy = e.clientY - (r.bottom - 55);
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
    setAnswer(null);
    const show = setTimeout(() => setHint(true), 2500);
    const hide = setTimeout(() => setHint(false), 8000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      setHint(false);
    };
  }, [pathname]);

  // Escape or a click elsewhere closes the panel.
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

  const inEditor = editing();
  if (bot.enabled === false && !inEditor) return null;

  const close = () => {
    setOpen(false);
    setAnswer(null);
  };
  const bubble = open ? null : hover || hint ? greeting(pathname, bot.bubbles) : null;

  return (
    <motion.div
      ref={ref}
      data-cube-bot=""
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
            className="relative mb-3 w-56 origin-bottom-right rounded-2xl rounded-br-md border border-[#E5EAF4] bg-white px-4 py-3 text-[14px] font-medium leading-snug text-[#0A0626] shadow-[0_20px_40px_-20px_rgb(10_6_38/0.5)]"
          >
            <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" /> {bot.status}
            </span>
            {bubble}
          </motion.div>
        )}
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label={bot.title}
            initial={{ opacity: 0, transform: "translateY(10px) scale(0.96)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(8px) scale(0.96)" }}
            transition={{ duration: 0.22, ease }}
            className="mb-3 flex max-h-[calc(100svh-var(--cl-header,117px)-196px)] min-h-[220px] w-[min(372px,calc(100vw-40px))] origin-bottom-right flex-col overflow-hidden rounded-[24px] bg-white text-[#0A0626] shadow-[0_40px_80px_-24px_rgb(10_6_38/0.65),0_0_0_1px_rgb(10_6_38/0.08)]"
          >
            {/* Header */}
            <div className="relative flex shrink-0 items-center gap-3 overflow-hidden bg-[linear-gradient(120deg,#2300DC_0%,#0047FF_60%,#00A3FF_100%)] px-4 py-3.5 text-white">
              <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
              {answer ? (
                <button type="button" onClick={() => setAnswer(null)} aria-label="Back" className="relative -ml-1 rounded-lg p-1 transition-colors hover:bg-white/15">
                  <ChevronLeft size={20} />
                </button>
              ) : (
                <span aria-hidden="true" className="relative h-11 w-10 shrink-0">
                  <Bot look={{ x: 0, y: 0 }} happy blink={false} />
                </span>
              )}
              <span className="relative min-w-0 flex-1">
                <span className="block text-[16px] font-semibold leading-tight">{bot.title}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-white/85">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]" />
                  <span className="truncate">{bot.subtitle}</span>
                </span>
              </span>
              <button type="button" onClick={close} aria-label="Close" className="relative rounded-lg p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
              {answer ? (
                <div>
                  <p className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-[14px] font-medium text-white">{answer.q}</p>
                  <p className="mt-2.5 w-fit max-w-[92%] rounded-2xl rounded-bl-md bg-[#F0F4FB] px-3.5 py-2.5 text-[14px] leading-6 text-[#31343A]">{answer.a}</p>
                  <button type="button" onClick={() => setAnswer(null)} className="mt-3 inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-[13px] font-medium text-primary transition-colors hover:bg-[#F0F4FB]">
                    <ChevronLeft size={15} /> More questions
                  </button>
                </div>
              ) : (
                <>
                  <ul className="cl-fit gap-2 [--n:2]">
                    {bot.actions.map((a, i) => (
                      <li key={i}>
                        <BotAction action={a} navigate={navigate} close={close} />
                      </li>
                    ))}
                  </ul>
                  {bot.faqs.length > 0 && (
                    <>
                      <p className="mb-1 mt-4 px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B6E75]">{bot.questionsTitle}</p>
                      <ul className="divide-y divide-[#EEF1F7]">
                        {bot.faqs.map((f, i) => (
                          <li key={i}>
                            <button type="button" onClick={() => setAnswer(f)} className="group flex w-full items-center justify-between gap-3 rounded-lg px-1 py-2.5 text-left text-[14px] text-[#31343A] transition-colors hover:text-primary">
                              {f.q}
                              <ChevronRight size={16} className="shrink-0 text-[#9CA3AF] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-primary" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </div>

            {inEditor && (
              <a href="/admin/bot" className="flex shrink-0 items-center justify-center gap-2 border-t border-[#EEF1F7] bg-[#F5F8FF] py-2.5 text-[13px] font-medium text-primary hover:underline">
                <PencilLine size={14} /> Edit this bot
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Open Cube assistant"
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="group relative h-[110px] w-[100px] outline-none transition-transform duration-300 ease-out-expo hover:-rotate-3 hover:scale-105 focus-visible:scale-105"
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
