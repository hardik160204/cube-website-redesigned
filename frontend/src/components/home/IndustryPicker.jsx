import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { INDUSTRIES } from "./catalog";
import SectionIntro from "./SectionIntro";

// Cube industry grid: the ten industries as link tiles, two even rows of five on large screens.
const TILES = INDUSTRIES;

export default function IndustryPicker() {
  return (
    <section id="industries" className="scroll-mt-32 bg-white px-4 py-[60px] md:py-24">
      <div className="mx-auto w-full max-w-[1228px]">
        <SectionIntro label="Industries We Serve." title="Our products are designed to perform at" highlight="every arena" />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TILES.map(({ title, href, icon: Icon }) => (
            <li key={href}>
              <Link
                to={href}
                className="group flex h-[66px] items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-[15px] transition-colors hover:border-[#99B5FF] hover:bg-[#F7FAFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EEFF] text-primary">
                    <Icon size={20} />
                  </span>
                  <span className="line-clamp-2 text-[17px] font-medium leading-5 text-[#31343A]">{title}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-[#9CA3AF] transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
