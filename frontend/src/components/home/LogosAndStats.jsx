import React from "react";
import { CalendarClock, Globe2, Layers, Server } from "lucide-react";
import { LogoRows } from "../page/kit";
import { STATS } from "../../pages/AboutPage";
import SectionIntro from "./SectionIntro";

// Cube "Reviews & Recognition" block: customers and partners on two drifting logo rows over a row of big figures. Cube has no
// review-site ratings to show, so the figures are the About page's own numbers.
const STAT_ICONS = [CalendarClock, Server, Globe2, Layers];

export default function LogosAndStats() {
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-[1240px] px-4 md:px-6">
        <SectionIntro align="center" label="Customers & technology partners" title="Where every call counts," highlight="Cube is already on the line." />

        <LogoRows className="mt-14" />

        <div className="mt-14 grid grid-cols-2 gap-10 lg:flex lg:flex-wrap lg:justify-center lg:gap-16">
          {STATS.map(({ value, label }, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            return (
              <div key={label} className="flex flex-col gap-3 text-xs font-semibold uppercase leading-none tracking-[0.72px] md:flex-row md:items-center md:gap-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6EEFF] text-primary">
                  <Icon size={24} />
                </span>
                <div>
                  <p className="mb-1 text-[32px] font-medium leading-[110%] tracking-normal text-[#0A0626] md:text-[40px]">{value}</p>
                  <p className="text-primary">{label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
