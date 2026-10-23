import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Phone, ChevronDown, Menu, X, LogIn, ArrowRight, CheckCircle2,
  Bot, PhoneCall, Building, MessageSquare, Headset,
  ShieldCheck, PhoneOutgoing, Radio, Headphones,
  Landmark, Megaphone, MonitorPlay,
  Mic, Database, Receipt, Cloud, HeartPulse, TowerControl,
  Plane, Target, Heart, Flag, GraduationCap
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MotionButton } from "./ui/button";
import { MagneticLink } from "./ui/magnetic-link";
import { ease, springHover } from "../lib/motion";

// =========================================================================
// MEGA MENU DATA: SERVICES
// =========================================================================
const SERVICES_MEGA_DATA = [
  {
    id: "calling-solutions",
    label: "Cloud Services",
    icon: PhoneCall,
    items: [
      { icon: Cloud, title: "Cloud Contact Center", desc: "Complete omnichannel contact center", href: "/services/cloud-contact-center" },
      { icon: PhoneOutgoing, title: "Auto Dialer", desc: "Predictive, Progressive & Preview dialing engine", href: "/services/auto-dialer" },
      { icon: Radio, title: "IVRS Services", desc: "Custom IVR solutions built from scratch", href: "/services/ivrs" },
      { icon: Headphones, title: "Conference Bridge", desc: "Full-featured secure audio conferencing", href: "/services/conference-bridge" }
    ]
  },
  {
    id: "industry-solutions",
    label: "Industry Solutions",
    icon: Building,
    items: [
      { icon: Headset, title: "BPO – KPO", desc: "High-volume dialing & monitoring", href: "/industries/bpo" },
      { icon: Landmark, title: "Financial Services", desc: "Compliant recording & secure calling", href: "/industries/finance" },
      { icon: HeartPulse, title: "Healthcare", desc: "Patient-first communication suites", href: "/industries/healthcare" },
      { icon: Building, title: "Real Estate", desc: "Lead follow-up and site visit scheduling", href: "/industries/real-estate" },
      { icon: TowerControl, title: "Telecom", desc: "Carrier-grade telecom solutions", href: "/industries/telecom" },
      { icon: Plane, title: "Travel & Tourism", desc: "Peak season booking support", href: "/industries/travel" },
      { icon: Target, title: "Advertising", desc: "Campaign tracking & lead generation", href: "/industries/advertising" },
      { icon: Heart, title: "NGOs", desc: "Awareness & mass fundraising", href: "/industries/ngo" },
      { icon: Flag, title: "Election Campaigns", desc: "Voter outreach & surveys", href: "/industries/election" },
      { icon: GraduationCap, title: "Education", desc: "Student engagement & admissions", href: "/industries/education" },
    ]
  },
  {
    id: "whatsapp-solution",
    label: "WhatsApp Solution",
    icon: MessageSquare,
    items: [
      { icon: MessageSquare, title: "WhatsApp API", desc: "Official WhatsApp Business API integration", href: "/#contact" },
      { icon: Bot, title: "WhatsApp Chatbot", desc: "Automate customer support on WhatsApp", href: "/#contact" },
      { icon: Megaphone, title: "Broadcast Messaging", desc: "Send promotional messages at scale", href: "/#contact" },
    ]
  }
];

// =========================================================================
// MEGA MENU DATA: PRODUCTS
// =========================================================================
const PRODUCTS_MEGA_DATA = [
  {
    id: "voice",
    label: "Voice",
    icon: PhoneCall,
    items: [
      { icon: Cloud, title: "Contact Center Solution", desc: "Complete omnichannel contact center", href: "/services/ai-contact-center" },
      { icon: MessageSquare, title: "Cube Voice Mail", desc: "Exchange and process voice messages instantly", href: "/services/voice-mail" },
      { icon: Radio, title: "IVRS (Interactive Voice Response System)", desc: "Custom IVR solutions built from scratch", href: "/services/ivrs" },
      { icon: Headphones, title: "Conference Bridge", desc: "Secure multi-party audio conferencing rooms", href: "/services/conference-bridge" },
      { icon: GraduationCap, title: "Student Calling System", desc: "Secure calling solution for educational campuses", href: "/student-calling" },
      { icon: ShieldCheck, title: "Prison Calling System", desc: "Highly secure and managed inmate calling solutions", href: "/prison-calling" },
    ]
  },
  {
    id: "recordings",
    label: "Recordings",
    icon: Mic,
    items: [
      { icon: Mic, title: "Callisto Voice Logger", desc: "Crystal clear multi-protocol call recording", href: "/services/voice-logger" },
      { icon: MonitorPlay, title: "Callisto Screen Recording", desc: "Multi-PC screen recording synced with audio", href: "/services/screen-logger" },
      { icon: Database, title: "Callisto In-Sync", desc: "Centralised multi-site recording sync engine", href: "/services/voice-logger-insync" },
    ]
  },
  {
    id: "billing",
    label: "Billing",
    icon: Receipt,
    items: [
      { icon: Receipt, title: "Call Billing Software Basic", desc: "Essential telecom resource & cost management", href: "/billing/basic" },
      { icon: Receipt, title: "Call Billing Software Standard", desc: "Advanced billing rules and departmental tracking", href: "/billing/standard" },
      { icon: Receipt, title: "Call Billing Software Enterprise", desc: "Multi-site management with custom API integrations", href: "/billing/enterprise" }
    ]
  }
];

const MEGA_MENUS = [
  { label: "Services", data: SERVICES_MEGA_DATA, railTitle: "Solutions" },
  { label: "Products", data: PRODUCTS_MEGA_DATA, railTitle: "Categories" },
];

const NAV_LINKS = [
  { label: "Industries", href: "/#industries" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const QUICK_LINKS = [
  { label: "Click to Call", href: "/services/click-to-call" },
  { label: "Omni-channel Solution", href: "/#contact" },
];

const CONTACT_INFO = {
  expertLine: "+91 806 869 4440",
};

// Route prefixes that light up each mega-menu trigger.
const ACTIVE_PREFIXES = {
  Services: ["/services/cloud-contact-center", "/services/auto-dialer", "/services/ivrs", "/industries/"],
  Products: ["/services/voice-logger", "/services/call-billing", "/services/screen-logger", "/services/voice-mail", "/services/conference-bridge", "/services/voice-logger-insync", "/billing/"],
};


// Hover indicators are hit tens of times a session: fast and without bounce.
const INDICATOR_SPRING = { type: "spring", duration: 0.25, bounce: 0 };
// Apple-style spring from Emil Kowalski's tables for the one-time dock entrance.
const ENTRANCE_SPRING = { type: "spring", duration: 0.5, bounce: 0.2 };

// The dock drops in once per page load, not on every route change (each page mounts its own Navbar).
let dockHasEntered = false;

// Soft pill that glides between nav items via a shared layoutId.
const NavHighlight = () => (
  <motion.span
    layoutId="nav-highlight"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.12 } }}
    transition={INDICATOR_SPRING}
    className="absolute inset-0 rounded-full bg-foreground/[0.06]"
  />
);

const itemText = (highlighted) =>
  `relative flex items-center gap-1 transition-colors duration-150 ${highlighted ? "text-foreground" : "text-muted-foreground"}`;

// ---------------------------------------------------------------------------
// Desktop mega menu: opens on hover or click/Enter, closes on mouse-out, Escape,
// or focus leaving it. The panel is positioned against the pill (the nearest
// positioned ancestor), so it stays centered under the whole dock.
// ---------------------------------------------------------------------------
const MegaMenu = ({ menu, isOpen, highlighted, onHover, onOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tab = menu.data[activeTab];

  const open = () => {
    if (isOpen) return;
    setActiveTab(0);
    onOpen();
  };

  return (
    <div
      onMouseEnter={() => {
        onHover();
        open();
      }}
      onMouseLeave={onClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        onClose();
        e.currentTarget.querySelector("button")?.focus();
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={open}
        onFocus={onHover}
        className="relative rounded-full px-3 py-2 text-sm font-medium"
      >
        <AnimatePresence>{highlighted && <NavHighlight />}</AnimatePresence>
        <span className={itemText(highlighted)}>
          {menu.label}
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            // Scales from the dock it hangs off; exits faster than it enters.
            style={{ transformOrigin: "top center" }}
            initial={{ opacity: 0, transform: "translateY(-4px) scale(0.97)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 0.2, ease } }}
            exit={{ opacity: 0, transform: "translateY(-4px) scale(0.97)", transition: { duration: 0.12, ease } }}
            // pt-3 bridges the gap under the pill so the pointer can travel into the panel
            className="absolute inset-x-0 top-full mx-auto w-full max-w-[920px] pt-3"
          >
            <div className="glass bg-popover/95 overflow-hidden rounded-3xl">
              <div className="flex h-[400px]">
                <div className="flex w-[260px] flex-col gap-1 overflow-y-auto border-r border-border/70 bg-secondary/60 p-3">
                  <div className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {menu.railTitle}
                  </div>
                  {menu.data.map((item, index) => {
                    const selected = index === activeTab;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setActiveTab(index)}
                        onFocus={() => setActiveTab(index)}
                        className="relative w-full rounded-2xl px-3.5 py-3 text-sm"
                      >
                        {/* Selected card slides between categories instead of blinking */}
                        {selected && (
                          <motion.span
                            layoutId={`rail-${menu.label}`}
                            transition={INDICATOR_SPRING}
                            className="absolute inset-0 rounded-2xl bg-card shadow-card"
                          />
                        )}
                        <span
                          className={`relative flex items-center justify-between transition-colors duration-150 ${
                            selected ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <item.icon size={17} className={selected ? "text-primary" : "text-muted-foreground"} />
                            {item.label}
                          </span>
                          {selected && <ArrowRight size={15} className="text-primary" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 overflow-y-auto p-7">
                  <h3 className="mb-5 font-heading text-lg font-semibold text-foreground">{tab.label}</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    {tab.items.map((item) => (
                      <Link key={item.title} to={item.href} onClick={onClose} className="group flex items-start gap-3.5 rounded-2xl">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground ring-1 ring-inset ring-primary/10 transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                          <item.icon size={18} />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-foreground transition-colors group-hover:text-primary">{item.title}</span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{item.desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t border-border/70 bg-secondary/60 px-7 py-4">
                {QUICK_LINKS.map((q) => (
                  <Link key={q.label} to={q.href} onClick={onClose} className="flex items-center gap-2 rounded-md text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground">
                    <CheckCircle2 size={14} className="text-primary" />
                    {q.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Mobile sheet: drops below the pill with every link flattened.
// ---------------------------------------------------------------------------
const MobileSheet = ({ onClose }) => (
  <motion.div
    style={{ transformOrigin: "top center" }}
    initial={{ opacity: 0, transform: "translateY(-6px) scale(0.98)" }}
    animate={{ opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 0.2, ease } }}
    exit={{ opacity: 0, transform: "translateY(-6px) scale(0.98)", transition: { duration: 0.12, ease } }}
    className="absolute inset-x-0 top-full mt-3 lg:hidden"
  >
    <div className="glass bg-popover/95 max-h-[75vh] overflow-y-auto rounded-3xl p-3">
      {MEGA_MENUS.map((menu) => (
        <div key={menu.label} className="mb-2">
          <div className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-widest text-primary">{menu.label}</div>
          {menu.data.map((group) => (
            <div key={group.id} className="mt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-foreground">
                <group.icon size={15} className="text-primary" /> {group.label}
              </div>
              <div className="ml-4 border-l border-border pl-2">
                {group.items.map((item) => (
                  <Link key={item.title} to={item.href} onClick={onClose} className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground">
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="my-2 h-px bg-border" />

      {NAV_LINKS.map((link) => (
        <Link key={link.label} to={link.href} onClick={onClose} className="block rounded-xl px-3 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/[0.04]">
          {link.label}
        </Link>
      ))}

      <div className="my-2 h-px bg-border" />

      <a href={`tel:${CONTACT_INFO.expertLine.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/[0.04]">
        <Phone size={16} className="text-primary" /> {CONTACT_INFO.expertLine}
      </a>
      <Link to="/login" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/[0.04]">
        <LogIn size={16} className="text-muted-foreground" /> Customer Portal Login
      </Link>

      <MotionButton asChild {...springHover} className="mt-3 h-12 w-full rounded-full text-[15px] shadow-glow">
        <Link to="/contact" onClick={onClose}>Book a Demo</Link>
      </MotionButton>
    </div>
  </motion.div>
);

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const reduce = useReducedMotion();

  // Elevation grows with scroll: the dock's extra shadow fades in over the first 120px.
  const { scrollY, scrollYProgress } = useScroll();
  const elevation = useTransform(scrollY, [0, 120], [0, 1]);

  useEffect(() => {
    dockHasEntered = true;
  }, []);

  // Any navigation (including /#hash jumps) closes whatever is open.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const activeItem =
    MEGA_MENUS.find((m) => ACTIVE_PREFIXES[m.label].some((p) => location.pathname.includes(p)))?.label ??
    NAV_LINKS.find((l) => l.href === location.pathname)?.label ??
    null;
  // The highlight follows the pointer/focus, then an open menu, then rests on the current page.
  const highlight = hovered ?? openMenu ?? activeItem;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <motion.nav
        aria-label="Main"
        initial={dockHasEntered ? false : reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-16px) scale(0.98)" }}
        animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        transition={ENTRANCE_SPRING}
        className="pointer-events-auto relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-full pl-4 pr-2 sm:h-16 sm:pl-6"
      >
        {/* Background layers sit behind the content. The glass lives on a sibling layer because
            backdrop-filter on <nav> itself would stop the dropdowns inside it from blurring the page. */}
        <motion.div aria-hidden="true" style={{ opacity: elevation }} className="absolute inset-0 -z-10 rounded-full shadow-elevated" />
        <div aria-hidden="true" className="glass absolute inset-0 -z-10 rounded-full" />
        {/* Reading progress: a hairline along the dock's bottom edge, inset to stay inside the pill's curve */}
        <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="absolute inset-x-8 bottom-0 h-px origin-left bg-primary/60" />

        <Link to="/" className="flex shrink-0 items-center rounded-full">
          <img src="/logo75.png" alt="Cube Software home" className="h-8 w-auto object-contain sm:h-9" />
        </Link>

        <div
          className="hidden items-center gap-0.5 lg:flex"
          onMouseLeave={() => setHovered(null)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setHovered(null);
          }}
        >
          {MEGA_MENUS.map((menu) => (
            <MegaMenu
              key={menu.label}
              menu={menu}
              isOpen={openMenu === menu.label}
              highlighted={highlight === menu.label}
              onHover={() => setHovered(menu.label)}
              onOpen={() => setOpenMenu(menu.label)}
              onClose={() => setOpenMenu(null)}
            />
          ))}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onMouseEnter={() => setHovered(link.label)}
              onFocus={() => setHovered(link.label)}
              className="relative rounded-full px-3 py-2 text-sm font-medium"
            >
              <AnimatePresence>{highlight === link.label && <NavHighlight />}</AnimatePresence>
              <span className={itemText(highlight === link.label)}>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/login" className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex">
            Log in
          </Link>
          <MagneticLink to="/contact" className="hidden h-10 rounded-full px-5 shadow-glow sm:inline-flex">
            Book a Demo <ArrowRight />
          </MagneticLink>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="rounded-full p-2.5 text-foreground transition-colors hover:bg-foreground/[0.06] lg:hidden"
          >
            {/* Icon morphs between menu and close so the toggle reads as one control */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, transform: "rotate(-90deg)" }}
                animate={{ opacity: 1, transform: "rotate(0deg)" }}
                exit={{ opacity: 0, transform: "rotate(90deg)" }}
                transition={{ duration: 0.1, ease }}
                className="block"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence>{mobileOpen && <MobileSheet onClose={() => setMobileOpen(false)} />}</AnimatePresence>
      </motion.nav>
    </header>
  );
};

export default Navbar;
