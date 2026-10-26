import React from "react";
import { Link } from "react-router-dom";
import { Headset, Mail, Phone } from "lucide-react";
import { CONTACT, tel } from "./catalog";

// Cube  dark "available on every platform" band. Cube has no apps to download, so its store-style
// buttons are Cube's three direct lines instead.
const LINES = [
  { icon: Phone, caption: "Sales", value: CONTACT.sales, href: tel(CONTACT.sales) },
  { icon: Headset, caption: "Expert line", value: CONTACT.expert, href: tel(CONTACT.expert) },
  { icon: Mail, caption: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
];
const STORE_BUTTON =
  "inline-flex h-[50px] items-center gap-3.5 rounded-xl border border-[#33268F] bg-[#1A1052] px-5 text-white transition-colors hover:border-[#4A3BB5] hover:bg-[#22156B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00B8FF]";

export default function DirectLines() {
  return (
    <section className="relative overflow-hidden bg-[#0A0626] px-4 py-[60px] md:py-20 lg:pl-[150px] lg:pr-[108px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_85%_0%,rgb(35_0_220/0.55),transparent),radial-gradient(40%_60%_at_0%_100%,rgb(0_71_255/0.25),transparent)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1228px] flex-col gap-12 lg:gap-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="flex max-w-[760px] flex-col gap-3">
            <span className="text-xs font-semibold uppercase leading-4 tracking-[0.04em] text-[#00B8FF]">Contact</span>
            <h2 className="text-[32px] font-medium leading-[1.15] text-white md:leading-[52px]">Talk to sales or support</h2>
            <p className="text-lg leading-7 text-[#A9B3CC]">Tell us about your call volumes and our experts will help you choose the right setup.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:shrink-0 lg:flex-nowrap">
            {LINES.map(({ icon: Icon, caption, value, href }) => (
              <a key={caption} href={href} className={STORE_BUTTON}>
                <Icon size={26} className="shrink-0 text-[#C9D2EC]" />
                <span className="flex flex-col">
                  <span className="text-[13px] leading-4 text-[#A9B3CC]">{caption}</span>
                  <span className="whitespace-nowrap text-base font-medium leading-5">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-medium leading-8 text-white">Have more questions?</h3>
            <p className="text-lg leading-7 text-[#A9B3CC]">Can't find what you need? Talk to someone who has been doing telephony for 35 years.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:shrink-0">
            <a href="#faq" className={STORE_BUTTON}>
              Read the FAQ
            </a>
            <Link to="/client-voices" className={STORE_BUTTON}>
              Client voices
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
