import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { TiltCard } from "../ui/tilt-card";
import { useMediaQuery } from "../../hooks/use-media-query";
import { inView, reveal } from "../../lib/motion";
import SectionIntro from "./SectionIntro";

const TESTIMONIALS = [
  {
    company: "Yatra Online",
    badge: "Travel & Hospitality",
    author: "Rajesh Kumar",
    role: "Head of Customer Operations",
    rating: 5,
    quote: "Cube Software transformed our high-volume booking support lines. Their predictive dialer and multi-level IVRS deployment cut our customer wait times down by over 45% during peak holiday booking surges. The support from the team has been extraordinary.",
  },
  {
    company: "Fortis Healthcare",
    badge: "Healthcare Services",
    author: "Dr. Ananya Sharma",
    role: "Director of Patient Experience",
    rating: 5,
    quote: "Patient appointment reminders and emergency helpline routing require absolute 99.9% uptime. Cube's Callisto Voice Logger and custom IVR integration gave our hospitals the reliability we desperately needed. It has completely streamlined our internal operations.",
  },
  {
    company: "Inox Leisure",
    badge: "Entertainment & Cinema",
    author: "Vikram Mehta",
    role: "VP of IT & Infrastructure",
    rating: 5,
    quote: "Scaling our multi-city box office ticketing support across 10+ states was effortless with Cube's Cloud Contact Center. The supervisor wallboards give us complete real-time visibility, allowing us to respond to customer inquiries faster than ever before.",
  },
  {
    company: "Tech Mahindra",
    badge: "Global BPO Floor",
    author: "Priya Sundaram",
    role: "Senior Operations Manager",
    rating: 5,
    quote: "Migration from our legacy analog system to Cube's SIP trunking and Auto Dialer was completely seamless. Our agents are now fully productive working remotely from anywhere in the country, guaranteeing our clients the best possible engagement.",
  },
  {
    company: "Religare Finvest",
    badge: "Financial Services",
    author: "Amitabh Sen",
    role: "Chief Risk Officer",
    rating: 5,
    quote: "Compliance and tamper-proof audit trails are non-negotiable in financial lending. Cube's encrypted voice logging and secure database retrieval have made regulatory audits completely effortless for us. A highly secure and dependable solution.",
  },
  {
    company: "VLCC Wellness",
    badge: "Wellness & Retail",
    author: "Neha Kapoor",
    role: "Head of Digital Marketing",
    rating: 5,
    quote: "Our outbound promotional campaigns and lead conversions tripled within the first month of deploying Cube's smart predictive dialer engine. The ROI has been phenomenal, and the data analytics module allows us to track performance efficiently.",
  },
];

const initials = (name) =>
  name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

// Three columns; on desktop each drifts at its own rate as the section scrolls by, so the wall has depth.
const COLUMNS = [0, 1, 2].map((c) => TESTIMONIALS.filter((_, i) => i % 3 === c));
const DRIFT = [
  [80, -80],
  [-30, 30],
  [140, -40],
];

function VoiceCard({ testimonial: t }) {
  return (
    <TiltCard className="rounded-3xl border bg-card p-7 shadow-card transition-shadow duration-300 hover:shadow-elevated">
      <figure className="relative">
        <div className="flex gap-0.5 text-amber-400" role="img" aria-label={`${t.rating} out of 5 stars`}>
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} size={15} fill="currentColor" />
          ))}
        </div>
        <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/85">“{t.quote}”</blockquote>
        <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
            {initials(t.author)}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">{t.author}</span>
            <span className="block text-xs text-muted-foreground">
              {t.role}, {t.company}
            </span>
          </span>
        </figcaption>
      </figure>
    </TiltCard>
  );
}

function DriftColumn({ items, range, progress, drifting, index, variants }) {
  const y = useTransform(progress, [0, 1], range);
  return (
    <motion.ul style={drifting ? { y } : undefined} className="space-y-5">
      {items.map((t, i) => (
        <motion.li key={t.company} variants={variants} custom={index + i * 3}>
          <VoiceCard testimonial={t} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default function Voices() {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const card = reveal(reduce, "translateY(40px) scale(0.97)", "translateY(0px) scale(1)", 0.06);

  return (
    <section ref={ref} className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionIntro align="center" label="Client voices" title="Teams that run on Cube." />

        <motion.div {...inView} className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {isDesktop
            ? COLUMNS.map((items, c) => (
                <DriftColumn
                  key={c}
                  index={c}
                  items={items}
                  range={DRIFT[c]}
                  progress={scrollYProgress}
                  drifting={!reduce}
                  variants={card}
                />
              ))
            : TESTIMONIALS.map((t, i) => (
                <motion.div key={t.company} variants={card} custom={i}>
                  <VoiceCard testimonial={t} />
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  );
}
