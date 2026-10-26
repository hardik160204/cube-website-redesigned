import React, { useState } from "react";
import { MapPin, Phone, Clock, Building, Send, ShieldCheck, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { PageHero, Reveal, Section } from "../components/page/kit";

const EMPTY = { name: "", email: "", phone: "", company: "", jobTitle: "", website: "", interest: "", users: "", message: "" };

const FIELD =
  "w-full rounded-xl border border-[#E5EAF4] bg-[#F7F9FD] px-4 py-3.5 text-base text-[#0A0626] transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-[#9CA3AF] focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10";

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[#404348]">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.interest || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you! Our team will connect with you promptly.");
      setForm(EMPTY);
      setSubmitting(false);
    }, 1000);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const scrollToForm = () => document.getElementById("contact-form-section")?.scrollIntoView();

  return (
    <>
      <PageHero
        crumbs={["Contact"]}
        label="Thank you for your interest in Cube Software!"
        title="Get in"
        highlight="touch"
        body="We're here to assist you every step of the way. Share your details, and our telephony experts will connect with you promptly."
        image="/contact-hero-icon.png"
        imageAlt="Contact Cube Software"
        actions={
          <button
            type="button"
            onClick={scrollToForm}
            className="group inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-7 font-medium text-white shadow-[0_14px_30px_-14px_rgb(0_71_255/0.9)] transition-[background-color,transform] duration-200 hover:bg-[#2300DC] active:scale-[0.97]"
          >
            Connect with us <ArrowDown size={18} className="transition-transform group-hover:translate-y-0.5" />
          </button>
        }
      />

      <Section id="contact-form-section" tone="tint">
        <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          <Reveal className="rounded-[28px] border border-[#E5EAF4] bg-white p-7 shadow-[0_40px_80px_-50px_rgb(0_71_255/0.5)] sm:p-10">
            <h2 className="text-[28px] font-medium text-[#0A0626]">Send us a message</h2>
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="c-name" label="Full Name *">
                  <input id="c-name" type="text" required autoComplete="name" value={form.name} onChange={set("name")} className={FIELD} />
                </Field>
                <Field id="c-email" label="Work Email *">
                  <input id="c-email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className={FIELD} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="c-phone" label="Phone Number *">
                  <input id="c-phone" type="tel" required autoComplete="tel" value={form.phone} onChange={set("phone")} className={FIELD} />
                </Field>
                <Field id="c-company" label="Company Name">
                  <input id="c-company" type="text" autoComplete="organization" value={form.company} onChange={set("company")} className={FIELD} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="c-job" label="Job Title">
                  <input id="c-job" type="text" autoComplete="organization-title" value={form.jobTitle} onChange={set("jobTitle")} className={FIELD} />
                </Field>
                <Field id="c-site" label="Company Website">
                  <input id="c-site" type="url" autoComplete="url" value={form.website} onChange={set("website")} className={FIELD} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="c-interest" label="Interested In *">
                  <select id="c-interest" required value={form.interest} onChange={set("interest")} className={`${FIELD} cursor-pointer`}>
                    <option value="" disabled hidden>
                      Select Solution...
                    </option>
                    <option value="cloud-contact-center">Cloud Contact Center</option>
                    <option value="voice-logger">Voice Logger</option>
                    <option value="call-billing">Call Billing Software</option>
                    <option value="ivrs">IVRS Services</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                <Field id="c-users" label="Number of Users">
                  <select id="c-users" value={form.users} onChange={set("users")} className={`${FIELD} cursor-pointer`}>
                    <option value="" disabled hidden>
                      Select Size...
                    </option>
                    <option value="1-10">1 - 10 Users</option>
                    <option value="11-50">11 - 50 Users</option>
                    <option value="51-200">51 - 200 Users</option>
                    <option value="201+">200+ Users</option>
                  </select>
                </Field>
              </div>
              <Field id="c-message" label="Message *">
                <textarea id="c-message" required value={form.message} onChange={set("message")} className={`${FIELD} min-h-[130px] resize-none`} />
              </Field>
              <div className="mt-2 flex flex-col items-center gap-5 sm:flex-row">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-9 py-3.5 text-[17px] font-medium text-white shadow-[0_16px_30px_-14px_rgb(0_71_255/0.9)] transition-[background-color,transform] duration-200 hover:bg-[#2300DC] active:scale-[0.97] disabled:opacity-70 sm:w-auto"
                >
                  {submitting ? "Sending..." : "Send Message"} <Send size={18} />
                </button>
                <span className="flex items-center gap-2 text-sm text-[#6B6E75]">
                  <ShieldCheck size={16} className="text-primary" /> Secure and confidential.
                </span>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1} className="relative min-h-[460px] overflow-hidden rounded-[28px] border border-[#E5EAF4] shadow-[0_40px_80px_-50px_rgb(0_71_255/0.5)]">
            <iframe
              title="Cube Software Noida Office Map"
              src="https://maps.google.com/maps?q=Cube%20Software%20Pvt.%20Ltd.,%20Sector%2063,%20Noida&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <h2 className="text-center text-[32px] font-medium text-[#31343a] md:text-[45px]">Our Offices</h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-[1100px] gap-6 md:grid-cols-2">
          <Reveal className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0047FF,#2300DC)] p-9 text-white shadow-[0_30px_60px_-30px_rgb(35_0_220/0.8)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <MapPin size={28} />
            </span>
            <h3 className="mt-6 text-2xl font-medium">Corporate Office</h3>
            <p className="mt-3 text-[17px] leading-8 text-[#DCE6FF]">
              A-26, Ground Floor, Sector 63,
              <br />
              Noida, Uttar Pradesh 201301,
              <br />
              India
            </p>
          </Reveal>
          <Reveal delay={0.08} className="rounded-[28px] border border-[#E5EAF4] bg-white p-9 shadow-[0_30px_60px_-40px_rgb(0_71_255/0.4)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6EEFF] text-primary">
              <Building size={28} />
            </span>
            <h3 className="mt-6 text-2xl font-medium text-[#0A0626]">Registered Office</h3>
            <p className="mt-3 text-[17px] leading-8 text-[#404348]">
              E-44/3, Ground Floor,
              <br />
              Okhla Industrial Area, Phase-II,
              <br />
              New Delhi-110020, India
            </p>
          </Reveal>
          <Reveal delay={0.12} className="flex items-center gap-5 rounded-[22px] border border-[#E5EAF4] bg-white p-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D9F3FF] text-[#0047FF]">
              <Phone size={24} />
            </span>
            <div>
              <h4 className="text-lg font-medium text-[#0A0626]">Phone</h4>
              <a href="tel:+918068694440" className="text-[15px] text-[#404348] hover:text-primary">
                India: +91 806 869 4440
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.16} className="flex items-center gap-5 rounded-[22px] border border-[#E5EAF4] bg-white p-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFE5E5] text-[#FF0000]">
              <Clock size={24} />
            </span>
            <div>
              <h4 className="text-lg font-medium text-[#0A0626]">Office Hours</h4>
              <p className="text-[15px] leading-6 text-[#404348]">
                Mon – Fri: 9:30 AM to 8:00 PM (IST)
                <br />
                Saturday: 9:30 AM to 4:30 PM (IST)
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
