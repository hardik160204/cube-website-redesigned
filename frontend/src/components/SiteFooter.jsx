import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { SOCIAL_KEYS, useSiteData } from "../lib/site";
import { inView, reveal } from "../lib/motion";
import { CITIES, INDUSTRIES, PLATFORM, RESOURCES, SOLUTIONS, tel } from "./home/catalog";

const CONTACT_INFO = {
  expertLine: "+91 120 405 7109",
  india: "+91 806 869 4440",
  email: "sales@cube-software.com",
  indiaOffice: "A-26, Ground Floor, Sector 63, Noida, Uttar Pradesh 201301, India",
};

// Footer styles: sky headings, light-blue links that turn white on hover (readable on the dark ink).
const FOOTER_HEADING = "font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5CCBFF] mb-5";
// Text links get an underline that sweeps in from the left (scaling text itself would look jittery).
const FOOTER_LINK =
  "relative rounded-sm text-[#B8E4FF] transition-colors duration-150 hover:text-white after:pointer-events-none after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out-expo hover:after:scale-x-100";
const SOCIAL_LINK = "w-9 h-9 rounded-full bg-white/[0.04] ring-1 ring-inset ring-white/10 flex items-center justify-center text-[#B8E4FF] hover:bg-primary hover:text-white hover:ring-primary hover:[scale:1.1] transition-[background-color,color,box-shadow,scale] duration-200 ease-out-expo";

// Site footer on every page (App.js): cities, link columns and contact in a dark design:
// mono headings, sweep-underline links, columns rising in, and the giant wordmark rising from the bottom edge.
const COLUMNS = [
  [PLATFORM[0], PLATFORM[1]],
  [PLATFORM[2], PLATFORM[3]],
  [PLATFORM[4], { heading: "Solutions", links: SOLUTIONS.map(({ title, href }) => ({ label: title, href })) }],
  [{ heading: "Industries", links: INDUSTRIES.map(({ title, href }) => ({ label: title, href })) }],
  [{ heading: "Company", links: RESOURCES.map(({ title, href }) => ({ label: title, href })) }],
];
// Social links are set in the admin ("Team & social links"); empty ones are hidden.
const SOCIAL_ICONS = { facebook: Facebook, linkedin: Linkedin, instagram: Instagram, youtube: Youtube, x: Twitter };

export default function SiteFooter() {
  const { socials } = useSiteData();
  const SOCIALS = SOCIAL_KEYS.filter(([k]) => socials[k]).map(([k, label]) => ({ label, href: socials[k], icon: SOCIAL_ICONS[k] }));
  const reduce = useReducedMotion();
  // Columns rise in left to right, 80ms apart.
  const column = reveal(reduce, "translateY(24px)", "translateY(0px)", 0.08);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const markY = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);

  return (
    <footer ref={ref} className="dark relative overflow-hidden bg-background text-[#9FD6FF]">
      <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <motion.div {...inView} className="grid gap-10 border-b border-white/[0.07] pb-14 lg:grid-cols-12 lg:gap-8">
          <motion.div variants={column} custom={0} className="lg:col-span-4">
            <Link to="/" className="group inline-flex items-center rounded-md">
              <img src="/logo-77.png" alt="Cube Software home" className="h-10 w-auto object-contain transition-[scale] duration-300 ease-out-expo group-hover:[scale:1.05] sm:h-12" />
            </Link>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={SOCIAL_LINK}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={column} custom={1} className="lg:col-span-8">
            <p className={FOOTER_HEADING}>Go live anywhere</p>
            <h2 className="-mt-1 text-2xl font-medium tracking-[-0.02em] text-[#D6F0FF] md:text-3xl">Keep your numbers. We connect them to Cube, city by city.</h2>
            <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
              {CITIES.map((c) => (
                <li key={c.name}>
                  <Link to="/contact" className="group flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.04] font-mono text-xs text-[#5CCBFF] ring-1 ring-inset ring-white/10 transition-colors group-hover:bg-primary group-hover:text-white">
                      {c.code}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium text-[#D6F0FF]">{c.name}</span>
                      <span className="text-xs">STD {c.code}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div {...inView} className="grid grid-cols-2 gap-x-8 gap-y-10 pt-14 md:grid-cols-3 lg:grid-cols-6">
          {COLUMNS.map((groups, i) => (
            <motion.div key={i} variants={column} custom={i} className="space-y-10">
              {groups.map((g) => (
                <div key={g.heading}>
                  <p className={FOOTER_HEADING}>{g.heading}</p>
                  <ul className="space-y-3 text-sm">
                    {g.links.map((l) => (
                      <li key={l.href + l.label}>
                        <Link to={l.href} className={FOOTER_LINK}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          ))}
          <motion.div variants={column} custom={COLUMNS.length}>
            <p className={FOOTER_HEADING}>Reach us</p>
            <ul className="space-y-3.5 text-sm">
              <li className="flex gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#5CCBFF]" /> {CONTACT_INFO.indiaOffice}
              </li>
              {[CONTACT_INFO.india, CONTACT_INFO.expertLine].map((n) => (
                <li key={n} className="flex gap-2.5">
                  <Phone size={15} className="mt-0.5 shrink-0 text-[#5CCBFF]" />
                  <a href={tel(n)} className={FOOTER_LINK}>{n}</a>
                </li>
              ))}
              <li className="flex gap-2.5">
                <Mail size={15} className="mt-0.5 shrink-0 text-[#5CCBFF]" />
                <a href={`mailto:${CONTACT_INFO.email}`} className={FOOTER_LINK}>
                  {CONTACT_INFO.email.split("@")[0]}@<wbr />
                  {CONTACT_INFO.email.split("@")[1]}
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Giant wordmark, clipped at the bottom edge */}
      <div aria-hidden="true" className="pointer-events-none mx-auto mt-12 max-w-7xl overflow-hidden px-4 sm:px-6">
        <motion.p
          style={reduce ? undefined : { y: markY }}
          className="select-none bg-gradient-to-b from-[#00B8FF]/45 to-[#00B8FF]/0 bg-clip-text text-center font-['Archivo'] text-[26vw] font-extrabold leading-[0.78] tracking-[-0.07em] text-transparent lg:text-[21rem]"
        >
          CUBE
        </motion.p>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-[#7FD8FF] sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Cube Software Pvt. Ltd.</span>
          <span>Smart. Scalable. Secure Cloud Telephony.</span>
        </div>
      </div>
    </footer>
  );
}
