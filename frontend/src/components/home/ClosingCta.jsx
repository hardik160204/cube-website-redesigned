import React from "react";
import { ArrowUpRight } from "lucide-react";
import { MagneticLink } from "../ui/magnetic-link";
import { RevealText } from "../ui/reveal-text";

const EXPERT_LINE = "+91 806 869 4440";

/**
 * The close: navy, a short line, and one big round CTA that rings. The ripples are the
 * page's last telephone gesture — rings leave the button and fade (static for reduced motion).
 */
export default function ClosingCta() {
  return (
    <section className="dark relative isolate overflow-hidden bg-background py-28 text-foreground sm:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_60%,black,transparent)]" />
        <div className="absolute bottom-[-20%] left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px]" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-blue-400">
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
          Book a demo
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
        </p>
        <h2 className="mt-6 font-heading text-[clamp(2.75rem,8vw,7rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">
          <RevealText text="Ready when your phones are." />
        </h2>
        <RevealText
          as="p"
          delay={0.2}
          className="mt-6 block max-w-xl text-lg leading-relaxed text-muted-foreground"
          text="Tell us about your call volumes and our experts will help you choose the right setup."
        />

        <div className="mt-16 flex flex-col items-center gap-10 sm:flex-row sm:gap-14">
          <div className="relative grid place-items-center">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-primary/50 motion-safe:animate-ripple"
                style={{ animationDelay: `${i * 0.8}s` }}
              />
            ))}
            <MagneticLink
              to="/contact"
              pull={0.35}
              className="relative h-36 w-36 flex-col gap-1 rounded-full text-base shadow-glow hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.5),0_20px_60px_-12px_hsl(var(--primary)/0.8)] sm:h-44 sm:w-44"
            >
              Book a demo
              <ArrowUpRight />
            </MagneticLink>
          </div>

          <a
            href={`tel:${EXPERT_LINE.replace(/\s/g, "")}`}
            className="group relative font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            or call {EXPERT_LINE}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
          </a>
        </div>
      </div>
    </section>
  );
}
