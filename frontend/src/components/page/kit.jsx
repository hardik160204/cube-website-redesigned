import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, Phone } from "lucide-react";
import { useSpotlight } from "../../hooks/use-pointer-motion";
import { CONTACT, tel } from "../home/catalog";
import SectionIntro from "../home/SectionIntro";
import { DIAMONDS } from "../home/cube-diamonds";
import { CLIENT_LOGOS, PARTNER_LOGOS } from "../clients-and-partners";
import { openDemo } from "../demo";
import { useList } from "../../lib/editable";
import MediaSlot from "../MediaSlot";

// The inner pages' building blocks, in the homepage's language: logo palette, Outfit type, dark ink
// (#0A0626) bands, 28px radii, Emil's ease-out, and reveal-on-scroll that reduced motion turns off.
export const ease = [0.23, 1, 0.32, 1];
export const ACCENTS = ["#00B8FF", "#0047FF", "#2300DC", "#FF0000"];
export { SectionIntro };

// --- Motion -----------------------------------------------------------------------------------
export function Reveal({ as = "div", delay = 0, y = 24, className = "", children, ...rest }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      initial={reduce ? false : { opacity: 0, transform: `translateY(${y}px)` }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </M>
  );
}

// --- Buttons: every CTA goes somewhere real ---------------------------------------------------
export function CtaButtons({ primary = "Book a demo", secondary = "Talk to an expert", phone = CONTACT.expert, dark = false, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={openDemo}
        className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 font-medium text-white shadow-[0_14px_30px_-14px_rgb(0_71_255/0.9)] transition-[background-color,transform] duration-200 hover:bg-[#2300DC] active:scale-[0.97]"
      >
        {primary} <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
      {secondary && (
        <a
          href={tel(phone)}
          className={`inline-flex h-12 items-center justify-center gap-2 rounded-lg border px-7 font-medium transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97] ${
            dark ? "border-white/25 text-white hover:bg-white/10" : "border-[#0A0626] bg-[#0A0626] text-white hover:bg-white hover:text-[#0A0626]"
          }`}
        >
          <Phone size={16} /> {secondary}<span className="hidden lg:inline">&nbsp;· {phone}</span>
        </a>
      )}
    </div>
  );
}

// --- Page hero ----------------------------------------------------------------------------------
// Dark ink band with the AI section's drifting light and moving grid. `video` plays full-bleed behind the
// copy; `image` sits framed on the right. `stats` run along the bottom edge.
export function PageHero({ crumbs = [], label, title, highlight, body, image, imageAlt = "", media, video, backdrop, stats, actions, children }) {
  const reduce = useReducedMotion();
  const item = (i) => ({
    initial: reduce ? false : { opacity: 0, transform: "translateY(18px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: 0.7, ease, delay: 0.08 + i * 0.08 },
  });
  return (
    <section className="cl-hero relative isolate overflow-hidden bg-[#0A0626] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {video && (
          <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-45">
            <source src={video} type="video/mp4" />
          </video>
        )}
        {backdrop && <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />}
        <div className="cl-ai-blob cl-ai-b1" />
        <div className="cl-ai-blob cl-ai-b2" />
        <div className="cl-ai-grid" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0626_0%,rgb(10_6_38/0.85)_45%,rgb(10_6_38/0.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A0626] to-transparent" />
      </div>

      <div className={`mx-auto grid max-w-[1228px] items-center gap-12 px-4 pb-12 pt-10 md:pb-14 md:pt-12 lg:grid-cols-[1.05fr_0.95fr]`}>
        <div>
          {crumbs.length > 0 && (
            <motion.nav {...item(0)} aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-[13px] text-[#A9B3CC]">
              <Link to="/" className="transition-colors hover:text-white">
                Home
              </Link>
              {crumbs.map((c) => (
                <React.Fragment key={c}>
                  <ChevronRight size={13} />
                  <span className="last:text-white">{c}</span>
                </React.Fragment>
              ))}
            </motion.nav>
          )}
          {label && (
            <motion.span {...item(1)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#00B8FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00B8FF] shadow-[0_0_10px_#00B8FF]" />
              {label}
            </motion.span>
          )}
          <motion.h1 {...item(2)} className="mt-4 text-[34px] font-medium leading-[1.08] tracking-[-0.01em] sm:text-[44px] lg:text-[50px]">
            {title}
            {highlight && (
              <>
                {title ? " " : ""}
                <span className="bg-gradient-to-r from-[#00B8FF] via-[#3D7BFF] to-[#8A7CFF] bg-clip-text text-transparent">{highlight}</span>
              </>
            )}
          </motion.h1>
          {body && (
            <motion.p {...item(3)} className="mt-5 max-w-[600px] text-[17px] leading-7 text-[#C9D2EC]">
              {body}
            </motion.p>
          )}
          <motion.div {...item(4)} className="mt-7">
            {actions || <CtaButtons dark />}
          </motion.div>
          {children}
        </div>

        {/* The hero's art or animation; admins can swap it for their own video, GIF or picture. */}
        <MediaSlot id="hero" mediaClass="max-h-[420px] w-full rounded-[28px] object-contain">
          {!image && !media && <HeroOrb />}
          {(image || media) && (
            <motion.div
              initial={reduce ? false : { opacity: 0, transform: "translateY(24px) scale(0.97)" }}
              animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
              transition={{ duration: 0.9, ease, delay: 0.25 }}
              className="relative"
            >
              <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-[#0047FF]/40 blur-[90px]" />
              {media || (
                <div className="cl-float relative rounded-[28px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm">
                  <img src={image} alt={imageAlt} className="max-h-[380px] w-full rounded-[20px] object-contain" />
                </div>
              )}
            </motion.div>
          )}
        </MediaSlot>
      </div>

      {stats && (
        <div className="relative border-t border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <dl className={`mx-auto grid max-w-[1228px] divide-x divide-white/10 px-4 ${stats.length > 3 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"}`}>
            {stats.map((s, i) => (
              <motion.div {...item(5 + i)} key={s.label} className="px-3 py-6 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-xl font-medium leading-tight text-white [overflow-wrap:anywhere] sm:text-3xl lg:text-4xl">{s.value}</dd>
                <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8FA0C8] sm:text-xs">{s.label}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}

// --- Sections ----------------------------------------------------------------------------------
const TONES = {
  white: "bg-white",
  tint: "bg-[#F0F4FB]",
  dark: "cl-dark relative isolate overflow-hidden bg-[#0A0626] text-white",
};

export function Section({ tone = "white", id, className = "", inner = "", children }) {
  return (
    <section id={id} className={`${TONES[tone]} scroll-mt-32 px-4 py-16 md:py-24 ${className}`}>
      {tone === "dark" && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(70%_70%_at_50%_40%,black,transparent)]" />
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#2300DC]/40 blur-[110px]" />
          <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#00B8FF]/20 blur-[110px]" />
        </div>
      )}
      <div className={`mx-auto max-w-[1228px] ${inner}`}>{children}</div>
    </section>
  );
}

// A section heading that rises in on scroll.
export function Heading({ className = "", ...props }) {
  return (
    <Reveal className={className}>
      <SectionIntro {...props} />
    </Reveal>
  );
}

// --- Cards ----------------------------------------------------------------------------------------
const COLS = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

export function FeatureCard({ icon: Icon, title, desc, i = 0, dark = false, children }) {
  const accent = ACCENTS[i % ACCENTS.length];
  const spot = useSpotlight({ ring: "rgb(0 184 255 / 0.55)", wash: dark ? "rgb(0 184 255 / 0.08)" : "rgb(0 71 255 / 0.06)" });
  return (
    <Reveal as="li" delay={Math.min(i, 5) * 0.06} className="h-full">
      <div
        {...spot.handlers}
        className={`group/spot group relative flex h-full flex-col overflow-hidden rounded-[24px] border p-7 transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:[translate:0_-4px] ${
          dark
            ? "border-white/10 bg-white/[0.04] hover:border-[#00B8FF]/40"
            : "border-[#E5EAF4] bg-white hover:border-[#99B5FF] hover:shadow-[0_30px_60px_-30px_rgb(0_71_255/0.45)]"
        }`}
      >
        {spot.glow}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100" style={{ background: accent }} />
        {Icon && (
          <span
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-transform duration-300 ease-out-expo group-hover:[transform:rotate(-6deg)_scale(1.06)]"
            style={{ background: accent, boxShadow: `0 12px 24px -10px ${accent}` }}
          >
            <Icon size={22} />
          </span>
        )}
        <h3 className={`relative mt-5 text-xl font-medium leading-snug ${dark ? "text-white" : "text-[#0A0626]"}`}>{title}</h3>
        {desc && <p className={`relative mt-2.5 text-[15px] leading-6 ${dark ? "text-[#A9B3CC]" : "text-[#4A4D53]"}`}>{desc}</p>}
        {children}
      </div>
    </Reveal>
  );
}

export function FeatureCards({ items: builtIn, cols = 3, dark = false, className = "" }) {
  const { items, mark } = useList("features", builtIn);
  return (
    <ul {...mark} className={`grid gap-5 ${COLS[cols]} ${className}`}>
      {items.map((f, i) => (
        <FeatureCard key={`${i}-${f.title}`} {...f} desc={f.desc ?? f.description} i={i} dark={dark} />
      ))}
    </ul>
  );
}

// --- Steps: numbered, with a connector that draws itself across the row ------------------------
export function Steps({ items: builtIn, dark = false, className = "" }) {
  const reduce = useReducedMotion();
  const { items, mark } = useList("steps", builtIn);
  const cols = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" }[items.length] || "lg:grid-cols-3";
  return (
    <motion.div className={`relative ${className}`} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, margin: "-80px" }}>
      <motion.span
        aria-hidden="true"
        variants={{ hidden: { transform: "scaleX(0)" }, show: { transform: "scaleX(1)", transition: { duration: 1.2, ease } } }}
        className="absolute left-[8%] right-[8%] top-7 hidden h-[2px] origin-left bg-[linear-gradient(90deg,#FF0000,#2300DC,#0047FF,#00B8FF)] lg:block"
      />
      <ol {...mark} className={`relative grid gap-5 ${cols}`}>
        {items.map((s, i) => (
          <Reveal as="li" key={`${i}-${s.title}`} delay={0.15 + i * 0.12} className="flex flex-col items-start lg:items-center lg:text-center">
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#00B8FF,#0047FF_55%,#2300DC)] text-lg font-semibold text-white shadow-[0_0_0_6px_rgb(0_71_255/0.12),0_16px_30px_-12px_rgb(0_71_255/0.9)]">
              {s.icon ? <s.icon size={22} /> : String(i + 1).padStart(2, "0")}
            </span>
            <div className={`mt-5 w-full rounded-[22px] border p-6 text-left lg:text-center ${dark ? "border-white/10 bg-white/[0.04]" : "border-[#E5EAF4] bg-white"}`}>
              <span className={`font-mono text-xs ${dark ? "text-[#00B8FF]" : "text-primary"}`}>Step {i + 1}</span>
              <h3 className={`mt-1.5 text-lg font-medium leading-snug ${dark ? "text-white" : "text-[#0A0626]"}`}>{s.title}</h3>
              {(s.desc || s.description) && <p className={`mt-2 text-[15px] leading-6 ${dark ? "text-[#A9B3CC]" : "text-[#4A4D53]"}`}>{s.desc || s.description}</p>}
            </div>
          </Reveal>
        ))}
      </ol>
    </motion.div>
  );
}

// --- Split: art on one side, copy on the other ---------------------------------------------------
export function Split({ image, imageAlt = "", reverse = false, dark = false, children, media, bare = false }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <Reveal className={`relative ${reverse ? "lg:order-2" : ""}`}>
        <div aria-hidden="true" className={`absolute inset-[6%] rounded-full blur-[80px] ${dark ? "bg-[#0047FF]/35" : "bg-[#00B8FF]/20"}`} />
        {bare ? <div className="relative">{media}</div> : <div className={`relative overflow-hidden rounded-[28px] border p-3 ${dark ? "border-white/10 bg-white/[0.04]" : "border-[#E5EAF4] bg-white shadow-[0_40px_80px_-50px_rgb(0_71_255/0.5)]"}`}>
          {media || <img src={image} alt={imageAlt} loading="lazy" className="max-h-[460px] w-full rounded-[20px] object-contain transition-[scale] duration-700 ease-out-expo hover:[scale:1.03]" />}
        </div>}
      </Reveal>
      <Reveal delay={0.1} className={reverse ? "lg:order-1" : ""}>
        {children}
      </Reveal>
    </div>
  );
}

// Body copy for a split or a section: comfortable measure, never justified.
export function Prose({ paragraphs, dark = false, className = "" }) {
  return (
    <div className={`space-y-5 text-[17px] leading-8 ${dark ? "text-[#C9D2EC]" : "text-[#404348]"} ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function CheckList({ items: builtIn, dark = false, cols = 1, className = "" }) {
  const { items, mark } = useList("checklist", builtIn);
  return (
    <ul {...mark} className={`grid gap-3.5 ${cols === 2 ? "sm:grid-cols-2" : ""} ${className}`}>
      {items.map((b, i) => (
        <Reveal as="li" key={typeof b === "string" ? b : i} delay={Math.min(i, 6) * 0.05} className={`flex items-start gap-3 text-[16px] leading-7 ${dark ? "text-[#DCE3F5]" : "text-[#31343A]"}`}>
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9F3FF] text-[#0047FF]">
            <Check size={14} strokeWidth={3} />
          </span>
          <span>{b}</span>
        </Reveal>
      ))}
    </ul>
  );
}

// Numbered tiles for short items: use cases, industries, plan names.
export function Tiles({ items: builtIn, className = "", cols = 2 }) {
  const { items, mark } = useList("tiles", builtIn);
  return (
    <ul {...mark} className={`grid gap-4 ${cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} ${className}`}>
      {items.map((u, i) => (
        <Reveal as="li" key={`${i}-${u}`} delay={Math.min(i, 6) * 0.06}>
          <div className="group h-full rounded-[20px] border border-[#E5EAF4] bg-white p-5 transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:border-[#99B5FF] hover:shadow-[0_20px_40px_-24px_rgb(0_71_255/0.45)] hover:[translate:0_-3px]">
            <span className="bg-gradient-to-r from-[#00B8FF] to-[#2300DC] bg-clip-text font-mono text-2xl font-semibold text-transparent">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-2 font-medium text-[#0A0626]">{u}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

// A small uppercase label for blocks that are not full section intros.
export function Label({ children, dark = false }) {
  return <span className={`text-xs font-semibold uppercase tracking-[0.12em] md:text-[13px] ${dark ? "text-[#00B8FF]" : "text-[#0047FF]"}`}>{children}</span>;
}

// Headline used inside split blocks, matching SectionIntro's scale.
export function Title({ children, highlight, dark = false, className = "" }) {
  return (
    <h2 className={`mt-3 text-[30px] font-medium leading-[1.15] md:text-[40px] md:leading-[48px] ${dark ? "text-white" : "text-[#31343a]"} ${className}`}>
      {children}
      {highlight && (
        <>
          {children ? " " : ""}
          <span className={dark ? "text-[#00B8FF]" : "text-primary"}>{highlight}</span>
        </>
      )}
    </h2>
  );
}

// Module cards: a product's modules side by side, each with its list of capabilities.
export function ModuleCards({ modules, className = "" }) {
  const cols = modules.length >= 4 ? "lg:grid-cols-4" : modules.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <ul className={`grid gap-5 sm:grid-cols-2 ${cols} ${className}`}>
      {modules.map((m, i) => {
        const accent = ACCENTS[i % ACCENTS.length];
        return (
          <Reveal as="li" key={m.id || m.title} delay={Math.min(i, 5) * 0.08}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E5EAF4] bg-white p-7 transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:border-[#99B5FF] hover:shadow-[0_30px_60px_-30px_rgb(0_71_255/0.45)] hover:[translate:0_-4px]">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: accent, boxShadow: `0 12px 24px -10px ${accent}` }}>
                  {m.icon && <m.icon size={22} />}
                </span>
                <span className="font-mono text-xs text-[#9CA3AF]">Module {String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-xl font-medium leading-snug text-[#0A0626]">{m.title}</h3>
              <ul className="mt-4 flex flex-1 flex-col gap-3 border-t border-[#EDEEEF] pt-4">
                {m.items.map(({ text, icon: Icon }) => (
                  <li key={text} className="flex items-start gap-2.5 text-[14px] leading-[20px] text-[#4A4D53]">
                    {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}

// Icon diagram: the small labelled icons some pages drew instead of a picture, as a lit panel of tiles
// that pop in one by one inside a slowly turning ring.
export function IconTiles({ tiles, dark = false }) {
  const reduce = useReducedMotion();
  const cols = tiles.length > 4 ? "grid-cols-3" : "grid-cols-2";
  return (
    <div className={`relative isolate mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-full ${dark ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-[radial-gradient(circle_at_50%_40%,#FFFFFF,#E3F6FF_60%,#E6EEFF)]"}`}>
      <div aria-hidden="true" className="cl-ai-orbit !inset-[6%] [&::before]:!inset-0" />
      <ul className={`absolute inset-[16%] grid ${cols} content-center gap-3`}>
        {tiles.map((t, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <motion.li
              key={t.label}
              initial={reduce ? false : { opacity: 0, transform: "scale(0.85)" }}
              whileInView={{ opacity: 1, transform: "scale(1)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.1 }}
              className={`group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border text-center transition-colors duration-300 ${
                dark ? "border-white/10 bg-[#130B3E]/80 text-white" : "border-[#E5EAF4] bg-white text-[#0A0626] shadow-[0_14px_30px_-20px_rgb(0_71_255/0.6)]"
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition-transform duration-300 ease-out-expo group-hover:[transform:scale(1.1)]" style={{ background: accent, boxShadow: `0 10px 20px -8px ${accent}` }}>
                <t.icon size={20} />
              </span>
              <span className="px-1 text-[13px] font-medium leading-tight">{t.label}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

// The homepage's Cube orb, for heroes that have no picture of their own: rings, orbits and the logo's
// 12 diamonds at its heart. Pure CSS loops (site-effects.css), held still under reduced motion.
export function HeroOrb({ word = "Cube" }) {
  return (
    <div aria-hidden="true" className="cl-ai-scene relative mx-auto hidden h-[420px] w-[420px] max-w-full lg:block">
      <div className="cl-ai-orb cl-orb-static origin-top-left scale-[0.8077]">
        <span className="cl-ai-glow" />
        {[0, 1.25, 2.5, 3.75].map((d) => (
          <span key={d} className="cl-ai-ring" style={{ animationDelay: `${d}s` }} />
        ))}
        <span className="cl-ai-orbit">
          {[0, 120, 240].map((a) => (
            <i key={a} style={{ transform: `rotate(${a}deg) translateY(-180px)` }} />
          ))}
        </span>
        <span className="cl-ai-orbit cl-outer">
          {[60, 240].map((a) => (
            <i key={a} style={{ transform: `rotate(${a}deg) translateY(-230px)` }} />
          ))}
        </span>
        <span className="cl-ai-swirl" />
        <span className="cl-ai-core">
          <span className="relative block h-[72px] w-[104px]">
            {DIAMONDS.map((d) => (
              <span
                key={`${d.u},${d.v}`}
                className="cl-glint absolute h-[14px] w-[14px] rotate-45 rounded-[3px]"
                style={{ left: 45 + d.u * 13, top: 4 + d.v * 13, background: d.color, boxShadow: `0 0 12px ${d.color}`, animationDelay: `${d.v * 0.14}s` }}
              />
            ))}
          </span>
          <span className="cl-ai-wordmark">{word}</span>
        </span>
      </div>
    </div>
  );
}

// A row of logos drifting left, edges faded, paused on hover (cl-marquee in site-effects.css).
export function LogoMarquee({ logos, duration = "35s", reverse = false, alt = "Cube partner logo", className = "" }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-white/0" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-white/0" />
      <div className="cl-marquee">
        <ul className="cl-marquee-track items-center" style={{ "--cl-duration": duration, animationDirection: reverse ? "reverse" : undefined }}>
          {[0, 1].map((copy) =>
            logos.map((src) => (
              <li key={`${copy}-${src}`} aria-hidden={copy === 1} className="box-content flex h-14 w-[150px] shrink-0 items-center justify-center pr-16">
                <img src={src} alt={copy === 1 ? "" : alt} className="max-h-full max-w-full object-contain mix-blend-multiply" />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

// Two in-site links styled like the CTA pair (for heroes whose buttons go to other pages).
export function LinkPair({ primary, secondary, dark = true, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link to={primary.to} className="group inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-7 font-medium text-white shadow-[0_14px_30px_-14px_rgb(0_71_255/0.9)] transition-[background-color,transform] duration-200 hover:bg-[#2300DC] active:scale-[0.97]">
        {primary.label} <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
      {secondary && (
        <Link
          to={secondary.to}
          className={`group inline-flex h-12 items-center gap-2 rounded-lg border px-7 font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${dark ? "border-white/25 text-white hover:bg-white/10" : "border-[#0A0626] text-[#0A0626] hover:bg-[#0A0626] hover:text-white"}`}
        >
          {secondary.label} <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

// Vertical timeline whose spine draws itself as it scrolls into view.
export function Timeline({ items }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className="relative" initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, margin: "-80px" }}>
      <motion.span
        aria-hidden="true"
        variants={{ hidden: { transform: "scaleY(0)" }, show: { transform: "scaleY(1)", transition: { duration: 1.4, ease } } }}
        className="absolute bottom-2 left-[27px] top-2 w-[2px] origin-top bg-[linear-gradient(180deg,#00B8FF,#0047FF,#2300DC,#FF0000)]"
      />
      <ol className="space-y-6">
        {items.map((m, i) => (
          <Reveal as="li" key={m.year} delay={0.1 + i * 0.08} className="relative flex items-start gap-6">
            <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white font-mono text-[13px] font-semibold text-primary shadow-[0_0_0_4px_#F0F4FB,0_10px_24px_-10px_rgb(0_71_255/0.6)] ring-2 ring-primary">
              {m.year}
            </span>
            <p className="flex-1 rounded-[20px] border border-[#E5EAF4] bg-white p-5 text-[15px] leading-7 text-[#31343A] transition-[box-shadow,translate] duration-300 ease-out-expo hover:shadow-[0_20px_40px_-24px_rgb(0_71_255/0.45)] hover:[translate:4px_0]">
              {m.text}
            </p>
          </Reveal>
        ))}
      </ol>
    </motion.div>
  );
}

// Customers on one row drifting left, technology partners on the next drifting right.
export function LogoRows({ className = "" }) {
  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <LogoMarquee logos={CLIENT_LOGOS} alt="Cube customer logo" duration="38s" />
      <LogoMarquee logos={PARTNER_LOGOS} alt="Cube technology partner logo" duration="32s" reverse />
    </div>
  );
}

// The trust band used on the major pages: heading over the two logo rows.
export function TrustBand({ tone = "white", title = "Cloud Communications Trusted by Leading Businesses Across the Globe" }) {
  return (
    <Section tone={tone} className="!py-14 md:!py-20">
      <Heading label="Customers & technology partners" title={title} align="center" />
      <LogoRows className="mt-10" />
    </Section>
  );
}
