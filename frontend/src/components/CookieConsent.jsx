import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { ease } from "../lib/motion";
import { readConsent, saveConsent, useCookieSettingsRequest } from "../lib/consent";

// The cookie notice. New visitors, anyone whose choice is over 12 months old, and everyone after the notice
// changes see it until they choose; "Cookie settings" in the bottom strip reopens it. Accept and Reject are
// equally prominent, nothing optional is pre-ticked, and closing without choosing keeps optional cookies off.
const CATEGORIES = [
  {
    key: "essential",
    title: "Essential",
    desc: "Remember your cookie choice (for 12 months) and keep the site and its forms secure. No consent is needed for these; they're always on.",
    locked: true,
  },
  {
    key: "analytics",
    title: "Analytics",
    desc: "Count which pages are visited, the site you came from and your device type, so we can improve the site. No IP address, cookie or visitor id is stored. Deleted after 13 months.",
  },
  {
    key: "functional",
    title: "Maps",
    desc: "Show the Google Maps view of our office on the Contact page. Google sets its own cookies when the map loads.",
  },
];

function Toggle({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${checked ? "bg-primary" : "bg-[#D5DBE7]"}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

export default function CookieConsent() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [choices, setChoices] = useState({ functional: false, analytics: false });
  const first = useRef(null);

  useEffect(() => {
    if (readConsent()) return undefined;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  useCookieSettingsRequest(
    useCallback(() => {
      const c = readConsent();
      setChoices({ functional: Boolean(c?.functional), analytics: Boolean(c?.analytics) });
      setCustom(true);
      setOpen(true);
    }, [])
  );

  useEffect(() => {
    // Focus moves in only when the visitor opened settings themselves, not on page load.
    if (open && custom) first.current?.focus({ preventScroll: true });
  }, [open, custom]);

  const choose = (value) => {
    saveConsent(value);
    setOpen(false);
    setCustom(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-desc"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease } }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, transition: { duration: 0.18, ease } }}
          className="fixed inset-x-3 bottom-12 z-[70] max-w-[440px] rounded-3xl border border-[#E5EAF4] bg-white p-6 text-[#0A0626] shadow-[0_40px_80px_-30px_rgb(10_6_38/0.55)] sm:left-5 sm:right-auto"
        >
          <button
            type="button"
            onClick={() => (readConsent() ? setOpen(false) : choose({ functional: false, analytics: false }))}
            aria-label="Close and keep optional cookies off"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#6B6E75] transition-colors hover:bg-[#F0F4FB] hover:text-[#0A0626]"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF3FF] text-primary">
              <Cookie size={20} />
            </span>
            <h2 id="cookie-title" className="text-[18px] font-medium">
              Your privacy choices
            </h2>
          </div>
          <p id="cookie-desc" className="mt-3 text-[14px] leading-6 text-[#4A4D53]">
            We use strictly necessary storage to run this site. With your permission we also count page visits (no IP address or id kept) and load Google
            Maps, which sets its own cookies. We don't use advertising or cross-site tracking cookies. Change your choice anytime from <span className="font-medium text-[#0A0626]">Cookie settings</span> at the bottom of the page.
            See our{" "}
            <Link to="/privacy" className="font-medium text-primary underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>

          <AnimatePresence initial={false}>
            {custom && (
              <motion.ul
                initial={reduce ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto", transition: { duration: 0.25, ease } }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.15 } }}
                className="overflow-hidden"
              >
                {CATEGORIES.map((c) => (
                  <li key={c.key} className="mt-3 flex items-start justify-between gap-4 rounded-2xl bg-[#F5F8FD] p-4 first:mt-4">
                    <span>
                      <span className="block text-[14px] font-medium">{c.title}</span>
                      <span className="mt-0.5 block text-[13px] leading-5 text-[#5A5E66]">{c.desc}</span>
                    </span>
                    <Toggle label={c.title} checked={Boolean(c.locked || choices[c.key])} disabled={c.locked} onChange={(v) => setChoices({ ...choices, [c.key]: v })} />
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {custom ? (
              <button
                ref={first}
                type="button"
                onClick={() => choose(choices)}
                className="col-span-2 rounded-xl bg-primary py-3 text-[15px] font-medium text-white transition-[background-color,transform] duration-150 hover:bg-[#2300DC] active:scale-[0.97]"
              >
                Save my choices
              </button>
            ) : (
              <>
                <button
                  ref={first}
                  type="button"
                  onClick={() => choose({ functional: false, analytics: false })}
                  className="rounded-xl bg-[#0A0626] py-3 text-[15px] font-medium text-white transition-[background-color,transform] duration-150 hover:bg-[#1C1640] active:scale-[0.97]"
                >
                  Reject optional
                </button>
                <button
                  type="button"
                  onClick={() => choose({ functional: true, analytics: true })}
                  className="rounded-xl bg-primary py-3 text-[15px] font-medium text-white transition-[background-color,transform] duration-150 hover:bg-[#2300DC] active:scale-[0.97]"
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={() => setCustom(true)}
                  className="col-span-2 rounded-xl py-2 text-[14px] font-medium text-primary transition-colors hover:bg-[#F0F4FB]"
                >
                  Customise
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
