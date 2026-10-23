import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BentoGrid, BentoCard } from "./ui/bento";
import { SectionLabel, SectionTitle } from "./HomeSections2";
import { fadeUp, slideUp, stagger, inView } from "../lib/motion";

const MotionBentoGrid = motion.create(BentoGrid);
const MotionBentoCard = motion.create(BentoCard);

const PRODUCTS = [
  {
    key: "cloud-contact-center",
    title: "Contact Center Solution",
    tagline: "Get results with a powerful inbound, outbound and blended cloud contact center solution with full call disposition.",
    heroImage: "/contact-center.png",
  },
  {
    key: "voice-logger",
    title: "Callisto Voice Logger",
    tagline: "The ideal call recording solution — every conversation captured, compressed and searchable.",
    heroImage: "/voice-logger.png",
  },
  {
    key: "call-billing",
    title: "Call Billing Software",
    tagline: "Take command of telecom resources and costs across every office, hotel and facility.",
    heroImage: "/call-billing.png",
  },
  {
    key: "screen-logger",
    title: "Screen Logger",
    tagline: "Next-generation multi-PC screen recording over the network — see what your customers experienced.",
    heroImage: "/screen-logger.png",
  },
  {
    key: "voice-mail",
    title: "Cube Voice Mail",
    tagline: "Never miss a message — exchange, deliver and process voice messages automatically.",
    heroImage: "/voice-mail.png",
  },
  {
    key: "voice-logger-insync",
    title: "Voice Logger InSync",
    tagline: "Centralise critical recording data from every location into one synchronised archive.",
    heroImage: "/voice-logger-insync.png",
  },
];

// Bento recipe for 6 products: [4 tall][2][2] / [2][2][2]. The flagship gets the big tile.
const LAYOUT = [{ span: 4, tall: true }, { span: 2 }, { span: 2 }, { span: 2 }, { span: 2 }, { span: 2 }];

export default function OurProducts() {
  return (
    <section id="products" className="scroll-mt-28 py-24 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div {...inView} variants={stagger} className="text-center max-w-2xl mx-auto mb-14">
          <motion.div variants={fadeUp}><SectionLabel>Products</SectionLabel></motion.div>
          <motion.div variants={fadeUp}><SectionTitle>Our Products</SectionTitle></motion.div>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Contact center, recording and billing software, built in-house for 35+ years.
          </motion.p>
        </motion.div>

        <MotionBentoGrid {...inView} variants={stagger}>
          {PRODUCTS.map((product, i) => {
            const flagship = i === 0;
            return (
              <MotionBentoCard
                key={product.key}
                variants={slideUp}
                {...LAYOUT[i]}
                className={`rounded-3xl p-0 shadow-card transition-[translate,box-shadow,border-color] hover:shadow-elevated ${flagship ? "sm:col-span-2" : ""}`}
              >
                <Link
                  to={`/services/${product.key}`}
                  className="group flex h-full flex-col p-5 rounded-3xl focus-visible:-outline-offset-2"
                >
                  <div className={`overflow-hidden rounded-2xl ring-1 ring-slate-900/5 bg-secondary ${flagship ? "aspect-[16/9] lg:aspect-auto lg:flex-1 lg:min-h-[260px]" : "aspect-[16/9]"}`}>
                    <img
                      src={product.heroImage}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className={flagship ? "mt-6" : "mt-5"}>
                    <h3 className={`font-heading font-semibold text-foreground ${flagship ? "text-2xl" : "text-lg"}`}>
                      {product.title}
                    </h3>
                    <p className={`mt-2 text-muted-foreground leading-relaxed ${flagship ? "text-base max-w-xl" : "text-sm line-clamp-2"}`}>
                      {product.tagline}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Learn more
                      <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </MotionBentoCard>
            );
          })}
        </MotionBentoGrid>
      </div>
    </section>
  );
}
