import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { MODULES_DATA, PAGE_DATA } from "../../pages/CloudContactCenter";

// The contact center's four modules, laid out side by side so every one is readable at once.
// Copy is the contact center page's own. Each card's accent is a logo colour, in the logo's order.
const ACCENTS = ["#00B8FF", "#0047FF", "#2300DC", "#FF0000"];
const ease = [0.23, 1, 0.32, 1];

export default function ContactCenterModules() {
  const reduce = useReducedMotion();
  return (
    <section id="modules" className="bg-[#F0F3FA] px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1228px]">
        {/* One centred column over the four cards, so the block reads as a single symmetrical unit */}
        <div className="mx-auto flex max-w-[880px] flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-semibold uppercase leading-4 tracking-[0.04em] text-[#0047FF]">{PAGE_DATA.title}</span>
            <span className="rounded-full bg-[#D9F3FF] px-3 py-1 text-xs font-semibold uppercase leading-4 tracking-[0.04em] text-[#0047FF]">
              {PAGE_DATA.stats[0].value} {PAGE_DATA.stats[0].label}
            </span>
          </div>
          <h2 className="mt-4 text-[32px] font-medium leading-[1.15] text-[#31343a] md:text-[45px] md:leading-[54px]">
            Contact Center Modules for <br className="hidden md:block" />
            <span className="text-primary">End-to-End Business Communication</span>
          </h2>
          <p className="mt-5 max-w-[640px] text-lg leading-7 text-[#404348]">{PAGE_DATA.tagline}</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
            {PAGE_DATA.benefits.slice(1, 4).map((b) => (
              <li key={b} className="flex items-center gap-2 rounded-full border border-[#E5EAF4] bg-white px-4 py-2 text-[15px] text-[#31343A]">
                <Check size={16} className="shrink-0 text-primary" /> {b}
              </li>
            ))}
          </ul>
          <Link
            to="/services/ai-contact-center"
            className="group mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-7 font-medium text-white transition-colors hover:bg-[#2300DC]"
          >
            Explore {PAGE_DATA.title} <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES_DATA.map((m, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.li
                key={m.id}
                initial={reduce ? false : { opacity: 0, transform: "translateY(24px)" }}
                whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease, delay: i * 0.09 }}
                className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[#E5EAF4] bg-white p-6 transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:border-[#99B5FF] hover:shadow-[0_30px_60px_-30px_rgb(0_71_255/0.45)] hover:[translate:0_-6px]"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: accent, boxShadow: `0 12px 24px -10px ${accent}` }}>
                    <m.icon size={22} className="h-[22px] w-[22px]" />
                  </span>
                  <span className="font-mono text-xs text-[#9CA3AF]">Module {String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 text-xl font-medium leading-snug text-[#0A0626]">{m.title}</h3>
                <ul className="mt-4 flex flex-1 flex-col gap-3 border-t border-[#EDEEEF] pt-4">
                  {m.items.map(({ text, icon: Icon }) => (
                    <li key={text} className="flex items-start gap-2.5 text-[14px] leading-[20px] text-[#4A4D53]">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {text}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
