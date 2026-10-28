import React from "react";
import { Phone } from "lucide-react";
import { CONTACT, tel } from "./catalog";
import { openDemo } from "../demo";

// Cube closing band: a rounded logo-blue panel set in from the page edges (so it never runs into the footer).
// Kept simple and large: one line, two buttons, then the sales number big enough to read across a room.
// Inner pages pass their own closing line; the homepage uses the defaults.
export default function ClosingCta({
  label = "Book a demo",
  title = "Ready when your phones are.",
  body = "Tell us about your call volumes and our experts will help you choose the right setup.",
  primary = "Book a demo",
  children,
}) {
  return (
    <section className="w-full bg-white px-4 pb-14 pt-10 md:pb-20 md:pt-14">
      <div className="relative isolate mx-auto flex max-w-[1080px] flex-col items-center overflow-hidden rounded-[32px] bg-[linear-gradient(110deg,#2300DC_0%,#0047FF_55%,#0091FF_100%)] px-6 py-10 text-center shadow-[0_40px_80px_-40px_rgb(35_0_220/0.7)] md:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-white/10 blur-[90px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-20 -z-10 h-72 w-72 rounded-full bg-[#00B8FF]/25 blur-[90px]" />
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7FD8FF]">{label}</span>
        <h2 className="mt-3 max-w-[900px] text-[30px] font-medium leading-[1.12] text-white md:text-[40px] xl:text-[46px]">{title}</h2>
        <p className="mt-4 max-w-[760px] text-[16px] leading-7 text-[#DCE6FF] md:text-lg">{body}</p>
        {children}
        <div className="mt-7 flex w-full max-w-[500px] flex-col items-stretch justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={openDemo}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-white px-7 text-[17px] font-semibold text-primary shadow-[0_16px_30px_-16px_rgb(10_6_38/0.7)] transition-[background-color,transform] duration-200 hover:bg-[#E6EEFF] active:scale-[0.97]"
          >
            {primary}
          </button>
          <a
            href={tel(CONTACT.expert)}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/40 px-7 text-[17px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-white/10 active:scale-[0.97]"
          >
            <Phone size={18} /> Talk to an expert
          </a>
        </div>
        <p className="mt-6 text-xl font-medium text-white/80 md:text-2xl">Or</p>
        <a href={tel(CONTACT.sales)} className="group mt-2 text-[26px] font-medium leading-tight text-white md:text-[34px]">
          Call Us <span className="whitespace-nowrap underline decoration-white/30 underline-offset-8 transition-[text-decoration-color] group-hover:decoration-white">{CONTACT.sales}</span>
        </a>
      </div>
    </section>
  );
}
