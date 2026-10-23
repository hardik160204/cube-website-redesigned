import React from "react";
import { motion } from "framer-motion";
import { RevealText } from "../ui/reveal-text";
import { cn } from "../../lib/utils";
import { fadeUp, inView } from "../../lib/motion";

/**
 * The one section header pattern for Home: a mono label, a display title that reveals
 * line by line, and optional body copy that follows 150ms later. Colors come from tokens,
 * so it reads correctly inside light and `dark` sections.
 */
export default function SectionIntro({ label, title, body, align = "left", className }) {
  const centered = align === "center";

  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      <motion.p
        {...inView}
        variants={fadeUp}
        className={cn(
          "flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-primary dark:text-blue-400",
          centered && "justify-center"
        )}
      >
        <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
        {label}
      </motion.p>
      <h2 className="mt-5 font-heading text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.5rem]">
        <RevealText delay={0.05} text={title} />
      </h2>
      {body && (
        <RevealText as="p" delay={0.2} className="mt-5 block text-lg leading-relaxed text-muted-foreground" text={body} />
      )}
    </div>
  );
}
