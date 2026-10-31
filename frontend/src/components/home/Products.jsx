import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useSpotlight } from "../../hooks/use-pointer-motion";
import { useList } from "../../lib/editable";
import { CONTACT, tel } from "./catalog";
import SectionIntro from "./SectionIntro";

// Cube's products as a grid of cards. The six flagships and their taglines are the original homepage's;
// Auto Dialer, IVRS and Conference Bridge use their own pages' taglines. Five pictures are Cube's own (public/), Voice Mail is a
// downloaded Unsplash photo (public/products);
// shortcut: Auto Dialer, IVRS and Conference Bridge are hot-linked free Unsplash photos, download them into public/products before launch.
export const PRODUCTS = [
  {
    title: "Contact Center Solution",
    tag: "Flagship",
    tagline: "Get results with a powerful inbound, outbound and blended cloud contact center solution with full call disposition.",
    img: "/contact-center.png",
    href: "/services/ai-contact-center",
  },
  {
    title: "Callisto Voice Logger",
    tag: "Recording",
    tagline: "The ideal call recording solution — every conversation captured, compressed and searchable.",
    img: "/voice-logger.png",
    href: "/services/voice-logger",
  },
  {
    title: "Auto Dialer",
    tag: "Outbound",
    tagline: "Maximize agent talk time and campaign ROI with an intelligent predictive, progressive, and preview dialing engine.",
    img: "https://images.unsplash.com/photo-1553775282-20af80779df7?auto=format&fit=crop&w=1080&h=600&q=80",
    href: "/services/auto-dialer",
  },
  {
    title: "Call Billing Software",
    tag: "Billing",
    tagline: "Take command of telecom resources and costs across every office, hotel and facility.",
    img: "/call-billing.png",
    href: "/services/call-billing",
  },
  {
    title: "Screen Logger",
    tag: "Recording",
    tagline: "Next-generation multi-PC screen recording over the network — see what your customers experienced.",
    img: "/screen-logger.png",
    href: "/services/screen-logger",
  },
  {
    title: "IVRS Services",
    tag: "Inbound",
    tagline: "Custom IVR solutions built from scratch with the latest software, database and telecom technologies.",
    img: "https://images.unsplash.com/photo-1787834565306-6cc7169397e3?auto=format&fit=crop&w=1080&h=600&q=80",
    href: "/services/ivrs",
  },
  {
    title: "Conference Bridge",
    tag: "Collaboration",
    tagline: "Full-featured audio conferencing that connects smoothly with cloud services or your existing phone system.",
    img: "https://images.unsplash.com/photo-1616531770192-6eaea74c2456?auto=format&fit=crop&w=1080&h=600&q=80",
    href: "/services/conference-bridge",
  },
  {
    title: "Cube Voice Mail",
    tag: "Messaging",
    tagline: "Never miss a message — exchange, deliver and process voice messages automatically.",
    img: "/products/voice-mail.jpg",
    href: "/services/voice-mail",
  },
  {
    title: "Voice Logger InSync",
    tag: "Recording",
    tagline: "Centralise critical recording data from every location into one synchronised archive.",
    img: "/voice-logger-insync.png",
    href: "/services/voice-logger-insync",
  },
  {
    title: "Co-Browsing",
    tag: "Visual support",
    tagline: "See the same page together and guide customers step by step — only our website is shared, sensitive fields stay hidden.",
    img: "/products/co-browsing.svg",
    href: "/services/co-browsing",
  },
  {
    title: "Screen Sharing",
    tag: "Visual support",
    tagline: "Customers show their screen, a window or a tab — they choose what's shared, and can stop at any time.",
    img: "/products/screen-sharing.svg",
    href: "/services/screen-sharing",
  },
];

const ease = [0.23, 1, 0.32, 1];

// One card per product: the whole picture on top (never cropped), then the words.
function ProductCard({ p, i }) {
  const reduce = useReducedMotion();
  const spot = useSpotlight({ ring: "rgb(0 184 255 / 0.55)", wash: "rgb(0 71 255 / 0.08)" });
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, transform: "translateY(24px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease, delay: Math.min(i % 3, 2) * 0.08 }}
    >
      <Link
        to={p.href}
        {...spot.handlers}
        className="group/spot group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#E5EAF4] bg-white p-3 transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:border-[#99B5FF] hover:shadow-[0_30px_60px_-30px_rgb(0_71_255/0.45)] hover:[translate:0_-6px]"
      >
        {spot.glow}
        {/* Same 9:5 frame on every card; the whole picture sits inside, a blurred copy fills any edge */}
        <div className="relative aspect-[9/5] overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#E3F6FF,#E6EEFF_55%,#EDE8FF)]">
          {p.img && (
            <>
              <img src={p.img} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl" />
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                className="relative h-full w-full object-contain transition-[scale] duration-700 ease-out-expo group-hover:[scale:1.04]"
              />
            </>
          )}
        </div>
        <div className="relative flex flex-1 flex-col px-3 pb-3 pt-5">
          <span className="w-fit rounded-full bg-[#E6EEFF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">{p.tag}</span>
          <h3 className="mt-3 text-[22px] font-medium leading-tight text-[#0A0626]">{p.title}</h3>
          <p className="mt-2 text-[15px] leading-6 text-[#4A4D53]">{p.tagline}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-medium text-primary">
            Explore
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

export default function Products() {
  // Admins can add, remove, reorder and rewrite these cards in the visual editor ("Edit cards").
  const { items, mark } = useList("products", PRODUCTS);
  return (
    <section id="products" className="relative isolate scroll-mt-32 overflow-hidden bg-white px-4 py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgb(0_71_255/0.05)_1px,transparent_1px),linear-gradient(-45deg,rgb(0_71_255/0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(55%_45%_at_80%_8%,black,transparent)]" />
        <div className="absolute right-[4%] top-0 h-[420px] w-[420px] rounded-full bg-[#00B8FF]/15 blur-[110px]" />
      </div>

      <div className="mx-auto max-w-[1228px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            label="Our products"
            title="Software we build ourselves,"
            highlight="since 1990."
            body="Contact center, call recording, dialing, IVR and call billing — each product works on its own and alongside the others."
          />
          <a href={tel(CONTACT.expert)} className="group inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-lg border border-[#E5EAF4] bg-white px-6 font-medium text-primary transition-colors hover:border-primary lg:self-auto">
            Talk to an expert<span className="hidden lg:inline">&nbsp;· {CONTACT.expert}</span> <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <ul {...mark} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <ProductCard key={`${i}-${p.title}`} p={p} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
