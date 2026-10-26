import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useSpotlight } from "../../hooks/use-pointer-motion";
import { CONTACT, tel } from "./catalog";
import SectionIntro from "./SectionIntro";

// Cube's products as a bento wall. The six flagships and their taglines are the original homepage's;
// Auto Dialer, IVRS and Conference Bridge use their own pages' taglines. Photos are free-licence Unsplash images (public/products), one chosen per product.
const PRODUCTS = [
  {
    title: "Contact Center Solution",
    tag: "Flagship",
    tagline: "Get results with a powerful inbound, outbound and blended cloud contact center solution with full call disposition.",
    img: "/products/contact-center.jpg",
    href: "/services/ai-contact-center",
    tile: "hero",
  },
  {
    title: "Callisto Voice Logger",
    tag: "Recording",
    tagline: "The ideal call recording solution — every conversation captured, compressed and searchable.",
    img: "/products/voice-logger.jpg",
    href: "/services/voice-logger",
    tile: "wide",
  },
  {
    title: "Auto Dialer",
    tag: "Outbound",
    tagline: "Maximize agent talk time and campaign ROI with an intelligent predictive, progressive, and preview dialing engine.",
    img: "/products/auto-dialer.jpg",
    href: "/services/auto-dialer",
    tile: "wide",
  },
  {
    title: "Call Billing Software",
    tag: "Billing",
    tagline: "Take command of telecom resources and costs across every office, hotel and facility.",
    img: "/products/call-billing.jpg",
    href: "/services/call-billing",
  },
  {
    title: "Screen Logger",
    tag: "Recording",
    tagline: "Next-generation multi-PC screen recording over the network — see what your customers experienced.",
    img: "/products/screen-logger.jpg",
    href: "/services/screen-logger",
  },
  {
    title: "IVRS Services",
    tag: "Inbound",
    tagline: "Custom IVR solutions built from scratch with the latest software, database and telecom technologies.",
    img: "/products/ivrs.jpg",
    href: "/services/ivrs",
  },
  {
    title: "Conference Bridge",
    tag: "Collaboration",
    tagline: "Full-featured audio conferencing that connects smoothly with cloud services or your existing phone system.",
    img: "/products/conference-bridge.jpg",
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
    img: "/products/voice-logger-insync.jpg",
    href: "/services/voice-logger-insync",
  },
];

// Bento placement on large screens (12 columns): the flagship spans two rows beside the two wide tiles.
const SPAN = { hero: "sm:col-span-2 lg:col-span-7 lg:row-span-2", wide: "sm:col-span-2 lg:col-span-5", small: "lg:col-span-4" };
const ease = [0.23, 1, 0.32, 1];

function ProductCard({ p, i }) {
  const reduce = useReducedMotion();
  const spot = useSpotlight({ ring: "rgb(0 184 255 / 0.55)", wash: "rgb(0 71 255 / 0.08)" });
  const hero = p.tile === "hero";
  const wide = p.tile === "wide";

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, transform: "translateY(24px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease, delay: Math.min(i, 5) * 0.07 }}
      className={SPAN[p.tile || "small"]}
    >
      <Link
        to={p.href}
        {...spot.handlers}
        className={`group/spot group relative flex h-full overflow-hidden rounded-[28px] border transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:[translate:0_-4px] ${
          hero
            ? "min-h-[460px] flex-col justify-end border-transparent bg-[#0A0626] text-white shadow-[0_40px_80px_-40px_rgb(35_0_220/0.8)] lg:min-h-full"
            : `border-[#E5EAF4] bg-white hover:border-[#99B5FF] hover:shadow-[0_30px_60px_-30px_rgb(0_71_255/0.4)] ${wide ? "flex-col sm:flex-row" : "flex-col"}`
        }`}
      >
        {spot.glow}

        {/* Product art: full-bleed on the flagship, framed on the rest */}
        <div
          className={
            hero
              ? "absolute inset-0"
              : `relative overflow-hidden bg-[linear-gradient(135deg,#2300DC,#0047FF_60%,#00B8FF)] ${wide ? "aspect-[16/10] sm:aspect-auto sm:w-[46%] sm:shrink-0" : "aspect-[16/10]"}`
          }
        >
          <img
            src={p.img}
            alt=""
            loading="lazy"
            className={`h-full w-full object-cover ${hero ? "object-[68%_center]" : ""} transition-[scale] duration-700 ease-out-expo group-hover:[scale:1.06] ${hero ? "opacity-90" : ""}`}
          />
          {hero && <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_6_38/0)_25%,rgb(10_6_38/0.75)_60%,#0A0626_92%)]" />}
        </div>

        <div className={`relative flex flex-col ${hero ? "p-7 sm:p-9" : "flex-1 p-6"}`}>
          <span
            className={`w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${
              hero ? "bg-[#FF0000] text-white" : "bg-[#E6EEFF] text-primary"
            }`}
          >
            {p.tag}
          </span>
          <h3 className={`mt-3 font-medium leading-tight ${hero ? "text-[32px] sm:text-[40px]" : "text-[22px] text-[#0A0626]"}`}>{p.title}</h3>
          <p className={`mt-2 ${hero ? "max-w-[520px] text-[17px] leading-7 text-[#C9D2EC]" : "line-clamp-3 text-[15px] leading-6 text-[#4A4D53]"}`}>{p.tagline}</p>
          <span className={`mt-auto inline-flex items-center gap-1.5 pt-5 font-medium ${hero ? "text-[#00B8FF]" : "text-primary"}`}>
            Explore
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

export default function Products() {
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
            Talk to an expert <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <ul className="mt-12 grid auto-rows-auto grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.title} p={p} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
