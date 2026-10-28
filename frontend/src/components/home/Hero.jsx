import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { Check, Mic, Phone, Receipt } from "lucide-react";
import { CONTACT, tel } from "./catalog";
import { initialType, typeDelay, typeStep } from "./typewriter";
import { openDemo } from "../demo";

// Cube hero, centred: proof badge, gradient headline with a typed audience, checks and two CTAs.
// The brand moment below it (PlatformOrbit) shows every Cube product around the mark.

const AUDIENCES = ["Contact Center & BPO's", "Banks & NBFC's", "Hotels & Hospitals", "OBD & SMS Campaigns"];
const LONGEST = AUDIENCES.reduce((a, b) => (b.length > a.length ? b : a));
const TRUST = ["99.5% uptime SLA", "Ready. Set. Go Live!", "Voice without Limits"];

function TypedAudience() {
  const reduce = useReducedMotion();
  const [state, setState] = useState(initialType);
  const [paused, setPaused] = useState(false);

  // Holds while hovered (WCAG 2.2.2); reduced motion shows the first word, typed in full and still.
  useEffect(() => {
    if (reduce || paused) return;
    const t = setTimeout(() => setState((s) => typeStep(s, AUDIENCES)), typeDelay(state, AUDIENCES));
    return () => clearTimeout(t);
  }, [state, paused, reduce]);

  const text = reduce ? AUDIENCES[0] : AUDIENCES[state.word].slice(0, state.length);
  return (
    <span aria-hidden="true" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} className="text-primary">
      <br className="md:hidden" />
      <span className="relative inline-block align-baseline">
        <span className="invisible whitespace-pre">{LONGEST}</span>
        <span className="absolute left-0 top-0 whitespace-pre">
          {text}
          {!reduce && <span className="cl-caret relative left-[3px] font-light">|</span>}
        </span>
      </span>
    </span>
  );
}

export default function Hero() {
  // Hero pieces rise in one after another, 80ms apart
  const delay = (ms) => ({ animationDelay: `${ms}ms` });
  return (
    <section className="relative flex flex-col items-center overflow-hidden bg-white bg-[radial-gradient(60%_45%_at_50%_0%,#E3F6FF,transparent)] pb-20">
      <div className="flex w-full flex-col items-center px-4">
        <div style={delay(0)} className="cl-fade-up mt-16">
          <div className="inline-flex h-10 items-center gap-3 whitespace-nowrap rounded-full border border-[#e5e7eb] bg-white pl-[7px] pr-[18px] shadow-[0_6px_16px_-10px_rgb(35_0_220/0.25)] transition-[border-color,box-shadow] duration-150 hover:border-primary hover:shadow-[0_10px_22px_-12px_rgb(0_71_255/0.45)]">
            <span className="hidden items-center sm:inline-flex">
              {[Phone, Mic, Receipt].map((Icon, i) => (
                <span key={i} className={`inline-flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-primary ${i ? "-ml-2" : ""}`}>
                  <Icon size={13} />
                </span>
              ))}
            </span>
            <span className="text-xs font-semibold text-[#31343a] sm:text-sm">Redefining Communication for the Modern World.</span>
          </div>
        </div>

        <div className="relative mt-6 w-[90%] text-center md:w-[560px] lg:w-[847px]">
          <svg aria-hidden="true" viewBox="0 0 30 30" className="absolute -top-4 left-0 h-7 w-7 -translate-x-1/2 text-[#FF0000] sm:left-6 lg:-top-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M14 3v7M5 9l5 4M22 9l-5 4" />
          </svg>
          <h1
            className="cl-fade-up mx-auto max-w-[95%] [text-wrap:wrap] bg-black bg-gradient-to-r from-[#00B8FF] via-[#0047FF] to-[#2300DC] bg-clip-text bg-no-repeat text-center text-[32px] font-medium leading-[1.15] text-transparent lg:text-[52px] lg:leading-[56px]"
            style={{ backgroundSize: "100% 1.2em", ...delay(80) }}
          >
            <span className="sr-only">Business Cloud Telephony System for contact centers & BPO's, Banks & NBFC's, Hotels & Hospitals, OBD & SMS campaigns.</span>
            <span aria-hidden="true">Business Cloud Telephony System for </span>
            <TypedAudience />
          </h1>
        </div>

        <p style={delay(160)} className="cl-fade-up mb-7 mt-5 w-full max-w-[619px] text-center text-base text-[#31343A] xl:text-xl">
          One software platform, one provider, and every communication function you need, fully integrated in the cloud.
        </p>

        <ul style={delay(240)} className="cl-fade-up mb-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8">
          {TRUST.map((t) => (
            <li key={t} className="flex items-center gap-1.5 text-sm font-medium text-[#31343A] md:text-base">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9F3FF] text-[#0047FF]">
                <Check size={14} strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>

        <div style={delay(320)} className="cl-fade-up flex w-full max-w-[260px] flex-col gap-2 lg:w-auto lg:max-w-none lg:flex-row lg:gap-5">
          <button
            type="button"
            onClick={openDemo}
            className="flex h-[52px] min-w-[197px] items-center justify-center rounded-lg border border-primary bg-primary px-14 font-medium text-white transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-[#2300DC] motion-reduce:hover:scale-100"
          >
            Book a demo
          </button>
          <a
            href={tel(CONTACT.expert)}
            className="flex h-[52px] items-center justify-center gap-2.5 whitespace-nowrap rounded-lg border border-[#0A0626] bg-[#0A0626] px-14 font-medium text-white transition-[background-color,color,border-color,transform] duration-200 hover:scale-105 hover:border-[#E5EAF5] hover:bg-white hover:text-[#0A0626] motion-reduce:hover:scale-100"
          >
            <Phone size={18} /> Talk to an expert<span className="hidden lg:inline">&nbsp;· {CONTACT.expert}</span>
          </a>
        </div>
      </div>

    </section>
  );
}
