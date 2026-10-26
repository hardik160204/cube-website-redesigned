import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Phone, Send, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { ease } from "../lib/motion";
import { CONTACT, tel } from "./home/catalog";
import { DEMO_EVENT } from "./demo";

// The demo form. It opens from any "Book a demo" button (DEMO_EVENT), and on its own once per visit when
// the visitor heads for the browser's top edge or sits idle for 20 seconds (`auto`).
const EMPTY = { name: "", phone: "", email: "", company: "", designation: "", interest: "", users: "", message: "" };

const FIELD =
  "w-full rounded-xl border border-[#E5EAF4] bg-[#F7F9FD] px-4 py-3 text-[15px] text-[#0A0626] transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-[#9CA3AF] focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10";

const POINTS = ["99.5% uptime SLA", "Ready. Set. Go Live!", "Voice without Limits"];

function Field({ id, label, children, wide }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-[#404348]">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function PopupContactForm({ auto = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const firstField = useRef(null);

  // Any "Book a demo" button opens the form.
  useEffect(() => {
    const open = () => {
      setIsOpen(true);
      setHasTriggered(true);
    };
    window.addEventListener(DEMO_EVENT, open);
    return () => window.removeEventListener(DEMO_EVENT, open);
  }, []);

  // --- SMART TRIGGERS: 20s Inactivity & Exit Intent ---
  useEffect(() => {
    if (!auto || hasTriggered) return;

    let idleTimer;

    const triggerPopup = () => {
      setIsOpen(true);
      setHasTriggered(true); // Ensures it only pops up once per session
    };

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(triggerPopup, 20000);
    };

    // clientY <= 0 means the mouse crossed the top edge of the browser viewport
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) triggerPopup();
    };

    resetIdleTimer();
    const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((event) => document.addEventListener(event, resetIdleTimer));
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(idleTimer);
      activityEvents.forEach((event) => document.removeEventListener(event, resetIdleTimer));
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [auto, hasTriggered]);

  // While open: Escape closes, the page behind does not scroll, and the first field takes focus.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstField.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      clearTimeout(t);
    };
  }, [isOpen]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      setForm(EMPTY);
      toast.success("Thank you! Our team will connect with you promptly.");
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="demo-title">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#0A0626]/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, transform: "translateY(16px) scale(0.98)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 0.28, ease } }}
            exit={{ opacity: 0, transform: "translateY(10px) scale(0.98)", transition: { duration: 0.15, ease } }}
            className="relative z-10 grid max-h-[94dvh] w-full max-w-[1080px] overflow-y-auto overscroll-contain rounded-[28px] bg-white shadow-[0_60px_120px_-40px_rgb(10_6_38/0.8)] md:grid-cols-[0.85fr_1.15fr] md:overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close modal"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F4FB] text-[#0A0626] transition-colors hover:bg-[#E6EEFF]"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Brand side */}
            <div className="relative isolate overflow-hidden bg-[#0A0626] p-8 text-white sm:p-10">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="cl-ai-blob cl-ai-b1" />
                <div className="cl-ai-grid" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#00B8FF]">Book a demo</span>
              <h2 id="demo-title" className="mt-4 text-[28px] font-medium leading-[1.15] sm:text-[34px]">
                Stop Juggling Tools—Switch to <span className="text-[#00B8FF]">Cube's Cloud Telephony</span>
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-[#C9D2EC]">
                Share your details, and our telephony experts will connect with you promptly.
              </p>
              <ul className="mt-7 space-y-3">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[15px] text-[#DCE3F5]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00B8FF]/15 text-[#00B8FF]">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <a href={tel(CONTACT.sales)} className="mt-9 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
                  <Phone size={18} />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.12em] text-[#8FA0C8]">Or call sales</span>
                  <span className="block text-lg font-medium">{CONTACT.sales}</span>
                </span>
              </a>
            </div>

            {/* Form side */}
            <form onSubmit={handleSubmit} className="p-7 sm:p-10">
              <h3 className="text-xl font-medium text-[#0A0626]">Tell us about your business</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field id="d-name" label="Full Name *">
                  <input ref={firstField} id="d-name" required autoComplete="name" value={form.name} onChange={set("name")} className={FIELD} />
                </Field>
                <Field id="d-phone" label="Phone Number *">
                  <input id="d-phone" type="tel" required autoComplete="tel" value={form.phone} onChange={set("phone")} className={FIELD} />
                </Field>
                <Field id="d-email" label="Business Email *">
                  <input id="d-email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className={FIELD} />
                </Field>
                <Field id="d-company" label="Company Name *">
                  <input id="d-company" required autoComplete="organization" value={form.company} onChange={set("company")} className={FIELD} />
                </Field>
                <Field id="d-designation" label="Designation">
                  <input id="d-designation" autoComplete="organization-title" value={form.designation} onChange={set("designation")} className={FIELD} />
                </Field>
                <Field id="d-users" label="Number of Users">
                  <select id="d-users" value={form.users} onChange={set("users")} className={`${FIELD} cursor-pointer`}>
                    <option value="">Select Size...</option>
                    <option value="1-10">1 - 10 Users</option>
                    <option value="11-50">11 - 50 Users</option>
                    <option value="51-200">51 - 200 Users</option>
                    <option value="201+">200+ Users</option>
                  </select>
                </Field>
                <Field id="d-interest" label="Interested In *" wide>
                  <select id="d-interest" required value={form.interest} onChange={set("interest")} className={`${FIELD} cursor-pointer`}>
                    <option value="" disabled>
                      Select Solution...
                    </option>
                    <option value="cloud-contact-center">Cloud Contact Center</option>
                    <option value="voice-logger">Voice Logger</option>
                    <option value="call-billing">Call Billing Software</option>
                    <option value="ivrs">IVRS Services</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                <Field id="d-message" label="Message" wide>
                  <textarea id="d-message" rows={3} value={form.message} onChange={set("message")} className={`${FIELD} resize-none`} />
                </Field>
              </div>
              <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-[16px] font-medium text-white shadow-[0_16px_30px_-14px_rgb(0_71_255/0.9)] transition-[background-color,transform] duration-200 hover:bg-[#2300DC] active:scale-[0.97] disabled:opacity-70 sm:w-auto"
                >
                  {isSubmitting ? "Sending Request..." : "Book my demo"} <Send size={17} />
                </button>
                <span className="flex items-center gap-2 text-sm text-[#6B6E75]">
                  <ShieldCheck size={16} className="text-primary" /> Secure and confidential.
                </span>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
