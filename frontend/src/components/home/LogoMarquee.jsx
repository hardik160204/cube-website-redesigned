import React from "react";
import { motion } from "framer-motion";
import { CLIENT_LOGOS } from "../HomeSections2";
import { fadeUp, inView } from "../../lib/motion";

/**
 * Client logos on one slow loop (CSS, pauses on hover, stops for reduced motion — see `.animate-marquee`).
 * Two identical copies make the -50% loop seamless; the second is hidden from assistive tech.
 */
export default function LogoMarquee() {
  return (
    <motion.section {...inView} variants={fadeUp} className="py-14 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-12">
        <p className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground lg:w-48">Running calls for</p>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center gap-14 pr-14">
                {CLIENT_LOGOS.map((src) => (
                  <li key={src} className="flex h-10 w-28 shrink-0 items-center justify-center">
                    <img
                      src={src}
                      alt=""
                      className="max-h-full max-w-full object-contain opacity-60 mix-blend-multiply grayscale transition-[filter,opacity,scale] duration-300 ease-out-expo hover:opacity-100 hover:grayscale-0 hover:[scale:1.08]"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
