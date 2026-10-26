import React from "react";
import { Link } from "react-router-dom";
import { CONTACT, tel } from "./catalog";

// Cube closing band: a rounded diagonal-blue panel set in from the page edges, so it never runs into the
// footer; one line, a white and a ghost button.
// Inner pages pass their own closing line; the homepage uses the defaults.
export default function ClosingCta({
  label = "Book a demo",
  title = "Ready when your phones are.",
  body = "Tell us about your call volumes and our experts will help you choose the right setup.",
  primary = "Book a demo",
  children,
}) {
  return (
    <section className="w-full bg-white px-4 pb-16 pt-12 md:pb-24 md:pt-16">
      <div className="relative isolate mx-auto flex max-w-[1228px] flex-col items-center overflow-hidden rounded-[32px] bg-[linear-gradient(110deg,#2300DC_0%,#0047FF_55%,#0091FF_100%)] px-6 py-14 text-center shadow-[0_40px_80px_-40px_rgb(35_0_220/0.7)] md:py-[72px]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-white/10 blur-[90px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-20 -z-10 h-72 w-72 rounded-full bg-[#00B8FF]/25 blur-[90px]" />
        <span className="text-[13px] font-semibold uppercase tracking-wide text-[#00B8FF] md:text-sm">{label}</span>
        <h2 className="mt-3 text-[28px] font-medium leading-[1.2] text-white md:text-[40px] xl:text-[48px]">{title}</h2>
        <p className="mt-5 relative max-w-[880px] text-[15px] leading-7 text-[#DCE6FF] md:text-[17px]">
          {body}
        </p>
        {children}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/contact" className="inline-flex h-12 min-w-[176px] items-center px-6 justify-center rounded-lg border border-white bg-white font-semibold text-primary transition-colors hover:bg-[#E6EEFF]">
            {primary}
          </Link>
          <a href={tel(CONTACT.expert)} className="inline-flex h-12 w-[196px] items-center justify-center rounded-lg border border-white/30 font-semibold text-white transition-colors hover:bg-white/10">
            Talk to an expert
          </a>
        </div>
        <p className="mt-5 text-[14px] text-[#9DB6EE]">Or call sales on {CONTACT.sales}</p>
      </div>
    </section>
  );
}
