import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MapPin, Phone, Mail, Send, Facebook, Linkedin, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { fadeUp, inView, reveal } from "../lib/motion";

// --- HARDCODED DATA ---
const CONTACT_INFO = {
  expertLine: "+91 120 405 7109",
  india: "+91 806 869 4440",
  email: "sales@cube-software.com",
  indiaOffice: "A-26, Ground Floor, Sector 63, Noida, Uttar Pradesh 201301, India",
};

export const CLIENT_LOGOS = [
  '/1.jpg', '/2.png', '/4.png', '/5.jpeg', 
  '/6.png', '/7.png', '/upsc.png', '/cars24.png', '/Yatra.png'
];

const PARTNER_LOGOS = [
  '/10.png', '/11.png', '/Avaya.jpeg', '/DigiCon.png', 
  '/Fusion.png', '/Mitel.png', '/ABSIndia.png'
];

export const SectionLabel = ({ children }) => (
  <div className="text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-[0.18em] uppercase mb-3">{children}</div>
);

export const SectionTitle = ({ children, className = "" }) => (
  <h2 className={`font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground leading-tight ${className}`}>
    {children}
  </h2>
);

// Logos sit grayscale and multiply away their white backgrounds; full color on hover.
const LOGO_IMG = "max-w-full max-h-full object-contain mix-blend-multiply grayscale opacity-70 transition-[filter,opacity] duration-300 hover:grayscale-0 hover:opacity-100";

export const ClientsSection = () => (
  <section className="py-16 lg:py-24 border-y border-border bg-secondary overflow-hidden relative">
    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

    <motion.div {...inView} variants={fadeUp} className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 text-center">
      <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">Trusted By</h2>
    </motion.div>

    <div className="flex flex-col gap-12 sm:gap-16">
      <div className="flex w-max">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ ease: "linear", duration: 35, repeat: Infinity }} 
          className="flex items-center gap-16 sm:gap-24 px-8"
        >
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logoPath, idx) => (
            <div key={idx} className="w-32 h-14 sm:w-40 sm:h-16 relative flex items-center justify-center shrink-0">
              <img src={logoPath} alt="Client Logo" className={LOGO_IMG} />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex w-max">
        <motion.div 
          animate={{ x: ["-50%", "0%"] }} 
          transition={{ ease: "linear", duration: 40, repeat: Infinity }} 
          className="flex items-center gap-16 sm:gap-24 px-8"
        >
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logoPath, idx) => (
            <div key={idx} className="w-32 h-14 sm:w-40 sm:h-16 relative flex items-center justify-center shrink-0">
              <img src={logoPath} alt="Partner Logo" className={LOGO_IMG} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you! Our team will reach out within 24 hours.");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
      setSubmitting(false);
    }, 700);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14">
        <div>
          <SectionLabel>Contact Us</SectionLabel>
          <SectionTitle>Let’s build your communication stack</SectionTitle>
          <p className="mt-4 text-slate-600 max-w-lg">Book a demo or ask us anything — our telephony experts respond within one business day.</p>
          <div className="mt-10 space-y-6">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0"><MapPin size={20} /></div>
              <div>
                <div className="font-heading font-bold text-slate-900 text-sm">India Office</div>
                <div className="text-sm text-slate-600">{CONTACT_INFO.indiaOffice}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0"><Phone size={20} /></div>
              <div>
                <div className="font-heading font-bold text-slate-900 text-sm">Phone</div>
                <div className="text-sm text-slate-600">India: {CONTACT_INFO.india}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0"><Mail size={20} /></div>
              <div>
                <div className="font-heading font-bold text-slate-900 text-sm">Email</div>
                <div className="text-sm text-slate-600">{CONTACT_INFO.email}</div>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl border border-slate-100 p-8 shadow-sm self-start">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input placeholder="Full name *" value={form.name} onChange={set("name")} className="bg-white h-11" />
            <Input type="email" placeholder="Work email *" value={form.email} onChange={set("email")} className="bg-white h-11" />
            <Input placeholder="Phone number *" value={form.phone} onChange={set("phone")} className="bg-white h-11" />
            <Input placeholder="Company" value={form.company} onChange={set("company")} className="bg-white h-11" />
          </div>
          <Textarea placeholder="Tell us about your requirements *" value={form.message} onChange={set("message")} className="bg-white mt-4 min-h-32" />
          <Button type="submit" disabled={submitting} className="mt-5 w-full bg-blue-700 hover:bg-blue-800 text-white h-12 text-base rounded-md transition-transform hover:-translate-y-0.5">
            {submitting ? "Sending..." : (<span className="flex items-center gap-2">Send Message <Send size={16} /></span>)}
          </Button>
        </form>
      </div>
    </section>
  );
};

// Shared footer styles: high-contrast headings, muted links that brighten on hover.
const FOOTER_HEADING = "font-mono text-[11px] uppercase tracking-[0.2em] text-foreground mb-5";
// Text links get an underline that sweeps in from the left (scaling text itself would look jittery).
const FOOTER_LINK =
  "relative rounded-sm transition-colors duration-150 hover:text-foreground after:pointer-events-none after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out-expo hover:after:scale-x-100";
const SOCIAL_LINK = "w-9 h-9 rounded-full bg-white/[0.04] ring-1 ring-inset ring-white/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:ring-primary hover:[scale:1.1] transition-[background-color,color,box-shadow,scale] duration-200 ease-out-expo";

const FOOTER_COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Quick Call Dialer", to: "/services/auto-dialer" },
      { label: "Callisto Voice Logger", to: "/services/callisto-voice-logger" },
      { label: "IVRS Services", to: "/services/ivrs" },
      { label: "Conference Bridge", to: "/services/conference-bridge" },
      { label: "Call Billing Software", to: "/services/call-billing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Client Voices", to: "/client-voices" },
      { label: "Industries", to: "/#industries" },
      { label: "FAQ", to: "/#faq" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

export const Footer = () => {
  const reduce = useReducedMotion();
  // Columns rise in left to right, 80ms apart.
  const column = reveal(reduce, "translateY(24px)", "translateY(0px)", 0.08);

  // The giant wordmark rises out of the bottom edge as the footer scrolls into view.
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const markY = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);

  return (
    <footer ref={ref} className="dark relative overflow-hidden bg-background text-muted-foreground">
      <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <motion.div {...inView} className="mx-auto grid max-w-7xl gap-12 px-4 pb-12 pt-20 sm:grid-cols-2 sm:px-6 lg:grid-cols-12 lg:gap-8">
        <motion.div variants={column} custom={0} className="sm:col-span-2 lg:col-span-5">
          <Link to="/" className="group inline-flex items-center rounded-md">
            <img src="/logo-77.png" alt="Cube Software home" className="h-10 w-auto object-contain transition-[scale] duration-300 ease-out-expo group-hover:[scale:1.05] sm:h-12" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            Computer telephony integration software for 35+ years — dialers, voice logging, screen recording,
            IVR and cloud telephony, trusted by enterprises across the globe.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="https://www.facebook.com/CSPLNOIDA/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={SOCIAL_LINK}>
              <Facebook size={16} />
            </a>
            <a href="https://www.linkedin.com/company/cube-software-private-limited-cspl-/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={SOCIAL_LINK}>
              <Linkedin size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={SOCIAL_LINK}>
              <Instagram size={16} />
            </a>
          </div>
        </motion.div>

        {FOOTER_COLUMNS.map((col, i) => (
          <motion.div key={col.title} variants={column} custom={i + 1} className="lg:col-span-2">
            <p className={FOOTER_HEADING}>{col.title}</p>
            <ul className="space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={FOOTER_LINK}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        <motion.div variants={column} custom={3} className="lg:col-span-3">
          <p className={FOOTER_HEADING}>Reach us</p>
          <ul className="space-y-3.5 text-sm">
            <li className="flex gap-2.5"><MapPin size={15} className="mt-0.5 shrink-0 text-blue-400" /> {CONTACT_INFO.indiaOffice}</li>
            <li className="flex gap-2.5">
              <Phone size={15} className="mt-0.5 shrink-0 text-blue-400" />
              <a href={`tel:${CONTACT_INFO.india.replace(/\s/g, "")}`} className={FOOTER_LINK}>{CONTACT_INFO.india}</a>
            </li>
            <li className="flex gap-2.5">
              <Mail size={15} className="mt-0.5 shrink-0 text-blue-400" />
              <a href={`mailto:${CONTACT_INFO.email}`} className={FOOTER_LINK}>{CONTACT_INFO.email}</a>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Giant wordmark, clipped at the bottom edge */}
      <div aria-hidden="true" className="pointer-events-none mx-auto max-w-7xl overflow-hidden px-4 sm:px-6">
        <motion.p
          style={reduce ? undefined : { y: markY }}
          className="select-none bg-gradient-to-b from-white/[0.16] to-white/0 bg-clip-text text-center font-heading text-[26vw] font-extrabold leading-[0.78] tracking-[-0.07em] text-transparent lg:text-[21rem]"
        >
          cube
        </motion.p>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 font-mono text-[11px] uppercase tracking-[0.14em] sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Cube Software Pvt. Ltd.</span>
          <span>Smart. Scalable. Secure cloud telephony.</span>
        </div>
      </div>
    </footer>
  );
};
