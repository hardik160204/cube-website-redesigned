import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DIAMONDS } from "./cube-diamonds";
import { PRODUCTS } from "./Products";
import { STATS } from "../../pages/AboutPage";
import { openDemo } from "../demo";
import MediaSlot from "../MediaSlot";
import SectionIntro from "./SectionIntro";

// The homepage's brand moment: the Cube mark at the centre, every product Cube builds circling it on two
// slowly turning ring (each chip links to its page and stays upright as it travels). Hovering the
// scene holds it still; reduced motion shows it at rest. The loops are CSS (site-effects.css).
const BOX = 600;
// One ring, so chips keep their spacing and never cross; the inner dashed circle is decoration.
// The core products only: more than nine chips crowd the ring (the visual-support features have cards below).
const RINGS = [{ r: 245, items: PRODUCTS.filter((p) => p.tag !== "Visual support"), dur: "90s", reverse: false }];
const GUIDES = [150, 245];
const ease = [0.23, 1, 0.32, 1];

function Ring({ r, items, dur, reverse, ringIndex }) {
  return (
    <div className={`cl-orbit-ring ${reverse ? "cl-rev" : ""}`} style={{ "--cl-orbit": dur }}>
      {items.map((p, i) => {
        const a = (i / items.length) * 2 * Math.PI + ringIndex * 0.6;
        return (
          <div key={p.href} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: BOX / 2 + r * Math.cos(a), top: BOX / 2 + r * Math.sin(a) }}>
            <div className={`cl-orbit-upright ${reverse ? "" : "cl-rev"}`} style={{ "--cl-orbit": dur }}>
              <Link
                to={p.href}
                className="block whitespace-nowrap rounded-full border border-white/15 bg-[#130B3E]/90 px-4 py-2 text-[14px] font-medium text-white shadow-[0_10px_30px_-12px_rgb(0_184_255/0.6)] backdrop-blur transition-[background-color,border-color,transform] duration-200 hover:scale-105 hover:border-[#00B8FF] hover:bg-primary"
              >
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#00B8FF] align-middle shadow-[0_0_8px_#00B8FF]" />
                {p.title}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Orbit() {
  return (
    <div className="cl-orbit cl-ai-scene relative" style={{ width: BOX, height: BOX }}>
      <span className="cl-ai-glow" />
      {[0, 1.25, 2.5].map((d) => (
        <span key={d} className="cl-ai-ring" style={{ animationDelay: `${d}s` }} />
      ))}
      {GUIDES.map((r) => (
        <span
          key={r}
          aria-hidden="true"
          className="absolute rounded-full border border-dashed border-[#00B8FF]/25"
          style={{ left: BOX / 2 - r, top: BOX / 2 - r, width: r * 2, height: r * 2 }}
        />
      ))}
      <span aria-hidden="true" className="cl-orbit-ring cl-rev" style={{ "--cl-orbit": "24s" }}>
        <i className="absolute h-2 w-2 rounded-full bg-[#FF0000] shadow-[0_0_12px_#FF0000]" style={{ left: BOX / 2 - 4, top: BOX / 2 - 154 }} />
        <i className="absolute h-2 w-2 rounded-full bg-[#00B8FF] shadow-[0_0_12px_#00B8FF]" style={{ left: BOX / 2 - 4, top: BOX / 2 + 146 }} />
      </span>
      {/* The logo's 12 diamonds, large, at the heart */}
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 block h-[120px] w-[170px] -translate-x-1/2 -translate-y-1/2">
        {DIAMONDS.map((d) => (
          <span
            key={`${d.u},${d.v}`}
            className="cl-glint absolute h-[22px] w-[22px] rotate-45 rounded-[5px]"
            style={{ left: 72 + d.u * 21, top: 6 + d.v * 21, background: d.color, boxShadow: `0 0 18px ${d.color}`, animationDelay: `${d.v * 0.14}s` }}
          />
        ))}
      </span>
      {RINGS.map((ring, k) => (
        <Ring key={ring.r} {...ring} ringIndex={k} />
      ))}
    </div>
  );
}

export default function PlatformOrbit() {
  const reduce = useReducedMotion();
  const rise = (i) => ({
    initial: reduce ? false : { opacity: 0, transform: "translateY(20px)" },
    whileInView: { opacity: 1, transform: "translateY(0px)" },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease, delay: i * 0.08 },
  });
  return (
    <section className="relative isolate overflow-hidden bg-[#0A0626] px-4 py-16 md:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="cl-ai-blob cl-ai-b1" />
        <div className="cl-ai-blob cl-ai-b2" />
        <div className="cl-ai-grid" />
      </div>
      <div className="mx-auto grid max-w-[1228px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <motion.div {...rise(0)}>
            <SectionIntro
              dark
              label="35+ years of computer telephony"
              title="Every Cube product,"
              highlight="one platform."
              body="Contact center, call recording, dialing, IVR and call billing — each product works on its own and alongside the others."
            />
          </motion.div>
          <motion.ul {...rise(1)} className="mt-10 grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <li key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="bg-gradient-to-r from-[#00B8FF] to-[#8A7CFF] bg-clip-text text-[34px] font-medium leading-none text-transparent">{s.value}</p>
                <p className="mt-2 text-sm text-[#A9B3CC]">{s.label}</p>
              </li>
            ))}
          </motion.ul>
          <motion.div {...rise(2)} className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={openDemo} className="inline-flex h-12 items-center rounded-lg bg-primary px-7 font-medium text-white transition-colors hover:bg-[#2300DC]">
              Book a demo
            </button>
            <a href="#products" className="group inline-flex h-12 items-center gap-2 rounded-lg border border-white/25 px-7 font-medium text-white transition-colors hover:bg-white/10">
              Explore products <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        {/* Scaled to fit narrow screens; the scene itself is drawn at 600px. Admins can swap it for a video, GIF or picture. */}
        <MediaSlot id="platform-orbit" className="relative mx-auto w-full max-w-[600px]" mediaClass="w-full rounded-[28px] object-contain">
          <div className="relative mx-auto h-[330px] w-[330px] sm:h-[480px] sm:w-[480px] xl:h-[600px] xl:w-[600px]">
            <div className="absolute left-0 top-0 origin-top-left scale-[0.55] sm:scale-[0.8] xl:scale-100">
              <Orbit />
            </div>
          </div>
        </MediaSlot>
      </div>
    </section>
  );
}
