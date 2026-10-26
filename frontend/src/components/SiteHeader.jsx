import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, ChevronRight, Factory, Layers, Mail, Menu, Phone, Receipt, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { PARTNER_LOGOS } from "./clients-and-partners";
import { CITIES, CONTACT, INDUSTRIES, PLATFORM, RESOURCES, SOLUTIONS, tel } from "./home/catalog";
import { openDemo } from "./demo";

// Site header on every page (App.js), a sticky navy announcement bar whose messages ripple
// in letter by letter, over a white bar with full-width mega panels.

const ANNOUNCEMENTS = [
  
  { parts: [["Cloud Telephony with Contact Center, Call Recording and Screen Recorder — "], ["One Platform", true], [" built in-house since "], ["1990", true], ["."]] },
  { parts: [["35+ ", true], ["Years of Telephony "],["Excellence",true],[" Enterprise "],[" Features.",true],["Small Business"],[" Pricing.",true] ] },
  { parts: [["Local Series, Toll-Free, Virtual and "], ["140/160", true], [" series numbers. Go live in Less time."]], link: ["Call Us", "/contact"] },
  { parts: [["Annual billing: "], ["save 20%", true], [" on Starter and Professional plans."]], link: ["See pricing", "/pricing"] },
];
const ROTATE_MS = 6000;

const MENUS = [
  { label: "Platform", panel: PlatformPanel },
  { label: "Solutions", panel: SolutionsPanel },
  { label: "Features", href: "/#features" },
  { label: "Resources", panel: ResourcesPanel },
  { label: "Pricing", href: "/pricing" },
];

// Fast, no bounce: menus are opened dozens of times a session.
const panelMotion = (reduce) => ({
  initial: reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-4px)" },
  animate: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.18, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
});

// --- Announcement bar ---------------------------------------------------------------------------
// Letters pop 4px, flash cyan and settle, 30ms apart  "wave"); spaces count toward the delay.
function WaveText({ parts }) {
  let n = 0;
  return parts.map(([text, highlight], p) => (
    <span key={p} className={highlight ? "font-bold text-[#00B8FF]" : undefined}>
      {text.split(/(\s+)/).map((word, w) => {
        if (!word) return null;
        if (/^\s+$/.test(word)) {
          n += 1;
          return word;
        }
        return (
          <span key={w} className="inline-block whitespace-nowrap">
            {[...word].map((ch, c) => (
              <span key={c} className="cl-wave-letter" style={{ animationDelay: `${n++ * 30}ms` }}>
                {ch}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  ));
}

function AnnouncementBar({ onClose }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Rotates every 6s; hovering or focusing the bar holds the current message (WCAG 2.2.2).
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused]);

  const message = ANNOUNCEMENTS[index];
  const plain = message.parts.map(([t]) => t).join("");
  const right = "inline-flex items-center gap-1.5 whitespace-nowrap underline-offset-2 hover:underline";

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative bg-gradient-to-r from-[#0A0626] via-[#2300DC] to-[#0A0626] text-[#F0F3F9]"
    >
      <div className="mx-auto flex min-h-12 max-w-[1440px] items-center pr-10 xl:min-h-[55px]">
        <div className="z-10 min-h-[20px] flex-1 overflow-hidden px-3 text-center text-[11px] leading-4 md:text-sm md:leading-5 xl:pl-4 xl:text-left">
          <div key={index} className="cl-slide-in inline">
            <span className="sr-only">{plain}</span>
            <span aria-hidden="true">
              <WaveText parts={message.parts} />
            </span>
            {message.link && (
              <Link to={message.link[1]} className="ml-2 font-medium underline underline-offset-2">
                {message.link[0]}
              </Link>
            )}
          </div>
        </div>
        <div className="hidden items-center gap-3 text-xs font-semibold uppercase xl:flex">
          <a href={tel(CONTACT.sales)} className={right}>
            <Phone size={13} /> Sales: <span className="underline">{CONTACT.sales}</span>
          </a>
          <span className="text-white/40">|</span>
          <a href={tel(CONTACT.expert)} className={right}>
            <Phone size={13} /> Expert line: <span className="underline">{CONTACT.expert}</span>
          </a>
        </div> {
        /*<button type="button" onClick={onClose} aria-label="Close announcement" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-white/80 hover:text-white">
          <X size={16} />
        </button>*/}
      </div>
    </div>
  );
}

// --- Mega panels ----------------------------------------------------------------------------------
const RAIL_ITEM = "flex w-full items-center gap-1.5 rounded-[10px] px-2 py-2.5 text-left transition-colors";

function PlatformPanel({ onNavigate }) {
  const [active, setActive] = useState(0);
  const category = PLATFORM[active];
  return (
    <div className="mx-auto flex max-w-[1224px]">
      <div className="my-8 flex w-[300px] shrink-0 flex-col gap-1">
        {PLATFORM.map((c, i) => (
          <button
            key={c.heading}
            type="button"
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`${RAIL_ITEM} ${i === active ? "bg-[#F0F3F9] text-primary" : "text-[#404348] hover:text-primary"}`}
          >
            <c.icon size={20} className="shrink-0" />
            <span className="flex-1 text-[17px] font-medium">{c.heading}</span>
            {i === active && <ChevronRight size={18} />}
          </button>
        ))}
      </div>

      <div className="ml-5 flex-1 border-l border-[#EDEEEF] px-6 py-8">
        <motion.div key={category.featured.href} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.15 } }} className="rounded-xl border-2 border-primary bg-white px-7 py-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[22px] font-medium text-[#404348]">{category.featured.title}</p>
            <Link to={category.featured.href} onClick={onNavigate} className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
              Learn more <ArrowUpRight size={15} />
            </Link>
          </div>
          <p className="mt-2 text-sm text-[#4A4D53]">{category.featured.desc}</p>
        </motion.div>
        <motion.ul key={category.heading} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.15 } }} className="mt-4 grid grid-cols-2 gap-x-6">
          {category.links.map(({ label, desc, href, icon: Icon }) => (
            <li key={href}>
              <Link to={href} onClick={onNavigate} className="group flex items-center gap-3 rounded-lg px-3 py-[10px] hover:bg-[#F5F8FF]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#EDEEEF] text-[#31343A]">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block text-base font-medium text-[#101828] group-hover:text-primary">{label}</span>
                  <span className="block text-sm text-[#7E7E7E]">{desc}</span>
                </span>
              </Link>
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

const SOLUTION_RAIL = [
  { label: "Solutions", icon: Layers, items: SOLUTIONS },
  { label: "Industries", icon: Factory, items: INDUSTRIES },
];

function SolutionsPanel({ onNavigate }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mx-auto flex max-w-[1224px]">
      <div className="my-8 flex w-[300px] shrink-0 flex-col gap-1">
        {SOLUTION_RAIL.map((r, i) => (
          <button
            key={r.label}
            type="button"
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`${RAIL_ITEM} ${i === active ? "bg-[#F0F3F9] text-primary" : "text-[#404348] hover:text-primary"}`}
          >
            <r.icon size={18} className="shrink-0" />
            <span className="flex-1 text-[15px] font-medium uppercase">{r.label}</span>
            {i === active && <ChevronRight size={18} />}
          </button>
        ))}
      </div>
      <motion.ul key={active} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.15 } }} className="ml-5 grid flex-1 grid-cols-2 content-start gap-x-10 border-l border-[#EDEEEF] px-8 py-7">
        {SOLUTION_RAIL[active].items.map(({ title, href, icon: Icon }) => (
          <li key={href}>
            <Link to={href} onClick={onNavigate} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-[#31343A] transition-colors hover:bg-[#F5F8FF] hover:text-primary">
              <Icon size={18} className="shrink-0 text-[#4A4D53]" />
              {title}
            </Link>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

const RESOURCE_COLUMNS = [
  { heading: "Company", items: RESOURCES.filter((r) => ["/about", "/meet-our-team", "/career"].includes(r.href)) },
  { heading: "Customers", items: RESOURCES.filter((r) => ["/client-voices", "/#faq", "/contact"].includes(r.href)) },
];

function ResourcesPanel({ onNavigate }) {
  const link = "flex items-center gap-3 py-2 text-[15px] text-[#31343A] transition-colors hover:text-primary";
  const card = "flex flex-col gap-3 rounded-xl border border-[#EDEEEF] p-4 text-[15px] text-[#31343A] transition-colors hover:border-[#99B5FF]";
  return (
    <div className="mx-auto max-w-[1224px] py-8">
      <div className="grid grid-cols-[1fr_1fr_1.15fr] gap-8">
        <div className="col-span-2 grid grid-cols-2 gap-8">
          {RESOURCE_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="mb-2 text-[13px] uppercase text-[#6B6E75]">{col.heading}</p>
              {col.items.map(({ title, href, icon: Icon }) => (
                <Link key={href} to={href} onClick={onNavigate} className={link}>
                  <Icon size={18} className="text-[#4A4D53]" /> {title}
                </Link>
              ))}
            </div>
          ))}
          <div className="col-span-2 rounded-xl border border-[#EDEEEF] px-5 py-4">
            <p className="text-[15px] font-medium text-[#31343A]">Talk to sales or support</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-primary">
              <a href={tel(CONTACT.sales)} className="underline underline-offset-2">Sales {CONTACT.sales}</a>
              <span className="text-[#C9CED8]">|</span>
              <a href={tel(CONTACT.expert)} className="underline underline-offset-2">Expert line {CONTACT.expert}</a>
              <span className="text-[#C9CED8]">|</span>
              <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-2">{CONTACT.email}</a>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-2 text-[13px] uppercase text-[#6B6E75]">Plans</p>
          <Link to="/pricing" onClick={onNavigate} className={`${card} h-[calc(100%-1.75rem)]`}>
            <Receipt size={18} className="text-[#4A4D53]" /> Pricing
            <span className="text-sm text-[#6B6E75]">Save 20% with annual billing</span>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between gap-6 rounded-xl border border-[#EDEEEF] px-5 py-4">
          <div>
            <p className="text-[15px] font-medium text-[#31343A]">CRM Integration</p>
            <p className="mt-1 text-sm text-[#6B6E75]">
              Salesforce, Freshdesk or your own CRM.{" "}
              <Link to="/services/crm-integration" onClick={onNavigate} className="text-primary underline underline-offset-2">
                View integration
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {PARTNER_LOGOS.slice(2, 5).map((src) => (
              <img key={src} src={src} alt="" className="h-7 w-14 object-contain mix-blend-multiply" />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-6 rounded-xl border border-[#EDEEEF] px-5 py-4">
          <div>
            <p className="text-[15px] font-medium text-[#31343A]">Go live with your numbers</p>
            <p className="mt-1 text-sm text-[#6B6E75]">
              Keep your numbers; we connect them to Cube.{" "}
              <Link to="/contact" onClick={onNavigate} className="text-primary underline underline-offset-2">
                See how
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {CITIES.slice(0, 5).map((c) => (
              <span key={c.name} title={`${c.name} · STD ${c.code}`} className="rounded-md border border-[#EDEEEF] bg-[#F6F8FD] px-2 py-1 font-mono text-[11px] text-[#404348]">
                {c.code}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Mobile sheet ---------------------------------------------------------------------------------
function MobileSheet({ onNavigate }) {
  const groups = [
    { label: "Platform", items: PLATFORM.flatMap((c) => c.links.map(({ label, href }) => ({ title: label, href }))) },
    { label: "Solutions", items: SOLUTIONS },
    { label: "Industries", items: INDUSTRIES },
    { label: "Resources", items: RESOURCES },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.18 } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      className="absolute inset-x-0 top-full max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain border-t border-[#EDEEEF] bg-white px-5 pb-10 lg:hidden"
    >
      <Accordion type="single" collapsible>
        {groups.map((g) => (
          <AccordionItem key={g.label} value={g.label} className="border-[#EDEEEF]">
            <AccordionTrigger className="text-lg font-medium text-[#31343A] hover:no-underline">{g.label}</AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-1 pb-2 sm:grid-cols-2">
                {g.items.map(({ title, href }) => (
                  <li key={href}>
                    <Link to={href} onClick={onNavigate} className="block rounded-lg px-3 py-2 text-[15px] text-[#404348] hover:bg-[#F5F8FF] hover:text-primary">
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {[["Features", "/#features"], ["Pricing", "/pricing"]].map(([label, href]) => (
        <Link key={href} to={href} onClick={onNavigate} className="block border-b border-[#EDEEEF] py-4 text-lg font-medium text-[#31343A]">
          {label}
        </Link>
      ))}
      <div className="mt-6 grid gap-3">
        <button type="button" onClick={() => { onNavigate(); openDemo(); }} className="rounded-lg bg-primary py-3 text-center font-medium text-white">
          Book a demo
        </button>
        <a href={tel(CONTACT.expert)} className="rounded-lg border border-[#EDEEEF] py-3 text-center font-medium text-primary">
          Talk to an expert
        </a>
        <a href={`mailto:${CONTACT.email}`} className="flex items-center justify-center gap-2 py-2 text-sm text-[#6B6E75]">
          <Mail size={14} /> {CONTACT.email}
        </a>
      </div>
    </motion.div>
  );
}

// --- Header ---------------------------------------------------------------------------------------
export default function SiteHeader() {
  const reduce = useReducedMotion();
  const location = useLocation();
  const [barOpen, setBarOpen] = useState(true);
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef();

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [location.pathname, location.hash]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // A 120ms grace period lets the pointer cross from a trigger into its panel without it closing.
  const openMenu = (label) => {
    clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };
  const closeAll = () => {
    clearTimeout(closeTimer.current);
    setOpen(null);
    setMobileOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50"
      onKeyDown={(e) => e.key === "Escape" && closeAll()}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(null);
      }}
    >
      {barOpen && <AnnouncementBar onClose={() => setBarOpen(false)} />}

      <nav aria-label="Main" className="relative border-b border-[#EDEEEF] bg-white">
        <div className="mx-auto flex h-[62px] max-w-[1280px] items-center gap-6 px-4 xl:px-6">
          <Link to="/" className="flex shrink-0 items-center">
            <img src="/logo75.png" alt="Cube Software home" className="h-9 w-auto object-contain" />
          </Link>

          <ul className="mx-auto hidden h-full items-center lg:flex">
            {MENUS.map((menu) => {
              if (!menu.panel) {
                return (
                  <li key={menu.label}>
                    <Link to={menu.href} className="px-4 text-base text-black transition-colors hover:text-primary">
                      {menu.label}
                    </Link>
                  </li>
                );
              }
              const isOpen = open === menu.label;
              const Panel = menu.panel;
              return (
                <li key={menu.label} className="flex h-full items-center" onPointerEnter={() => openMenu(menu.label)} onPointerLeave={scheduleClose}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => (isOpen ? setOpen(null) : openMenu(menu.label))}
                    className="relative flex h-full items-center gap-1 px-4 text-base"
                  >
                    <span className={isOpen ? "font-medium text-primary" : "text-black"}>{menu.label}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : "text-black"}`} />
                    {isOpen && (
                      <motion.span layoutId="cl-nav-underline" transition={{ type: "spring", duration: 0.3, bounce: 0 }} className="absolute inset-x-4 bottom-0 h-[2px] bg-primary" />
                    )}
                  </button>
                  {/* Inside the <li> so Tab moves from a trigger into its panel; absolute to the full-width <nav> */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div {...panelMotion(reduce)} className="absolute inset-x-0 top-full border-y border-[#F6F6F9] bg-white px-4 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.18)]">
                        <Panel onNavigate={closeAll} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <a
              href={tel(CONTACT.expert)}
              className="hidden rounded-lg border border-[#EDEEEF] bg-white px-4 py-1.5 font-medium text-primary transition-colors hover:border-primary/40 xl:inline-flex"
            >
              Talk to an expert<span className="hidden 2xl:inline">&nbsp;· {CONTACT.expert}</span>
            </a>
            <button type="button" onClick={openDemo} className="hidden rounded-lg border border-primary bg-primary px-4 py-1.5 font-medium text-white transition-colors hover:bg-[#2300DC] sm:inline-flex">
              Book a demo
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="rounded-lg p-2 text-[#31343A] hover:bg-[#F5F8FF] lg:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>{mobileOpen && <MobileSheet onNavigate={closeAll} />}</AnimatePresence>
      </nav>
    </header>
  );
}
