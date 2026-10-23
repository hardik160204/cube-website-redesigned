import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight, Flag, GraduationCap, HeartPulse, Headset, Heart, Landmark, Building, Plane, Target, TowerControl,
} from "lucide-react";
import { useSpotlight } from "../../hooks/use-pointer-motion";
import { useMediaQuery } from "../../hooks/use-media-query";
import { inView, reveal } from "../../lib/motion";
import SectionIntro from "./SectionIntro";

const INDUSTRIES = [
  { icon: Headset, title: "BPO – KPO", desc: "High-volume dialing and live monitoring", href: "/industries/bpo" },
  { icon: Landmark, title: "Financial services", desc: "Compliant recording and secure calling", href: "/industries/finance" },
  { icon: HeartPulse, title: "Healthcare", desc: "Patient-first communication suites", href: "/industries/healthcare" },
  { icon: Building, title: "Real estate", desc: "Lead follow-up and site-visit scheduling", href: "/industries/real-estate" },
  { icon: TowerControl, title: "Telecom", desc: "Carrier-grade telecom solutions", href: "/industries/telecom" },
  { icon: Plane, title: "Travel & tourism", desc: "Peak-season booking support", href: "/industries/travel" },
  { icon: Target, title: "Advertising", desc: "Campaign tracking and lead generation", href: "/industries/advertising" },
  { icon: Heart, title: "NGOs", desc: "Awareness drives and fundraising", href: "/industries/ngo" },
  { icon: Flag, title: "Election campaigns", desc: "Voter outreach and surveys", href: "/industries/election" },
  { icon: GraduationCap, title: "Education", desc: "Student engagement and admissions", href: "/industries/education" },
];
const ROWS = [INDUSTRIES.slice(0, 5), INDUSTRIES.slice(5)];

function IndustryCard({ industry, className = "" }) {
  const { icon: Icon, title, desc, href } = industry;
  const spot = useSpotlight();
  return (
    <Link
      to={href}
      {...spot.handlers}
      className={`group group/spot relative flex items-center gap-4 rounded-2xl border bg-card p-4 pr-5 shadow-card transition-[translate,box-shadow] duration-200 ease-out-expo hover:shadow-elevated hover:[translate:0_-3px] ${className}`}
    >
      {spot.glow}
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground ring-1 ring-inset ring-primary/10 transition-[scale] duration-200 ease-out-expo group-hover:[scale:1.08]">
        <Icon size={19} />
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="block font-heading font-semibold text-foreground">{title}</span>
        <span className="block text-sm leading-snug text-muted-foreground">{desc}</span>
      </span>
      <ArrowUpRight
        size={16}
        className="relative shrink-0 text-muted-foreground transition-[color,translate] duration-200 ease-out-expo group-hover:text-primary group-hover:[translate:2px_-2px]"
      />
    </Link>
  );
}

export default function Industries() {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Two rows drift in opposite directions as the section crosses the viewport.
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const forward = useTransform(scrollYProgress, [0, 1], ["4%", "-14%"]);
  const backward = useTransform(scrollYProgress, [0, 1], ["-14%", "4%"]);
  const drifting = isDesktop && !reduce;

  const card = reveal(reduce, "translateY(24px) scale(0.97)", "translateY(0px) scale(1)", 0.05);

  return (
    <section id="industries" ref={ref} className="scroll-mt-28 overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionIntro
          label="Industries"
          title="Tuned for the industries that live on the phone."
          body="From BPO floors to hospital helplines, each team gets the dialing, routing and recording setup its calls actually need."
        />
      </div>

      {drifting ? (
        <div className="mt-16 space-y-4">
          {ROWS.map((row, r) => (
            <motion.ul key={r} {...inView} style={{ x: r === 0 ? forward : backward }} className="flex w-max gap-4 px-6">
              {row.map((industry, i) => (
                <motion.li key={industry.title} variants={card} custom={i + r * 2}>
                  <IndustryCard industry={industry} className="h-full w-[21rem]" />
                </motion.li>
              ))}
            </motion.ul>
          ))}
        </div>
      ) : (
        <motion.ul {...inView} className="mx-auto mt-12 grid max-w-7xl gap-3 px-4 sm:grid-cols-2 sm:px-6">
          {INDUSTRIES.map((industry, i) => (
            <motion.li key={industry.title} variants={card} custom={i}>
              <IndustryCard industry={industry} />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </section>
  );
}
