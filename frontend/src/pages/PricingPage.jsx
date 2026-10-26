import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, Check, ChevronRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { CONTACT, tel } from "../components/home/catalog";
import { TrustBand } from "../components/page/kit";

export const PRICING_TIERS = [
  {
    name: "Starter / Basic",
    description: "Ideal for small support teams and growing office desks looking for reliable cloud telephony.",
    monthlyPrice: 1999,
    yearlyPrice: 1599,
    highlight: false,
    badge: "",
    features: [
      "Inbound & Outbound Calling",
      "Callisto Voice Logger (Standard)",
      "Basic IVR & Auto Attendant",
      "Voicemail-to-Email Delivery",
      "Real-time Call Records (CDR)",
      "Standard Email Support",
    ],
  },
  {
    name: "Professional / Contact Center",
    description: "Engineered for high-volume call centers needing predictive dialing and CRM integration.",
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    highlight: true,
    badge: "Most Popular",
    features: [
      "Everything in Starter, plus:",
      "Predictive / Progressive / Preview Dialer",
      "Skill-based Inbound ACD Routing",
      "Live Supervisor Monitoring & Barge-In",
      "CRM Connectors (Salesforce, Freshdesk)",
      "Screen Logger & Multi-PC Capture",
      "24/7 Priority Tech Support",
    ],
  },
  {
    name: "Enterprise Custom",
    description: "Custom-tailored telephony suites for multi-branch corporations, BPOs, and banks.",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    highlight: false,
    badge: "Scale Unlimited",
    features: [
      "Everything in Professional, plus:",
      "On-Premise, Hosted, or Hybrid Deployment",
      "Unlimited Channels & Concurrent Calls",
      "Custom IVR Database & ERP Integration",
      "Voice Logger InSync Multi-Site Sync",
      "Dedicated Account Manager & 99.9% SLA",
      "Custom Security & Compliance Audits",
    ],
  },
];

const PRICING_FAQS = [
  {
    q: "Can we switch between monthly and annual plans?",
    a: "Yes! You can upgrade, downgrade, or switch from monthly to annual billing at any time — just ask your Cube account team.",
  },
  {
    q: "Are there any hidden setup or license fees?",
    a: "No hidden charges. All license fees, standard support, and platform updates are included transparently in your quoted pricing.",
  },
  {
    q: "Do you offer on-premise hardware deployments?",
    a: "Yes. In addition to our cloud suite, Cube Software supports full on-premise server deployment for banking and high-security enterprises.",
  },
  {
    q: "How does the 24/7 support SLA work?",
    a: "Our professional and enterprise tiers include dedicated 24/7 technical hotline access and guaranteed response windows for critical line events.",
  },
];

const TRUST = [
  { icon: ShieldCheck, title: "100% Encrypted & Compliant", text: "Enterprise security standards protecting sensitive banking, healthcare, and corporate call archives." },
  { icon: Zap, title: "Zero Downtime Migration", text: "Our telephony experts assist in porting numbers and configuring agent trunks with no system interruption." },
  { icon: Building2, title: "On-Premise or Cloud", text: "Flexible hosting options tailored directly to your IT team's architecture requirements." },
];
const rupees = (n) => `Rs. ${n.toLocaleString("en-IN")}`;
// Hero pieces and plan cards rise in one after another
const delay = (ms) => ({ animationDelay: `${ms}ms` });

// The price rolls out and the new one rolls in when the billing interval changes.
function Price({ tier, isYearly, dark }) {
  if (typeof tier.monthlyPrice !== "number") {
    return <p className={`text-[40px] font-medium leading-[52px] ${dark ? "text-white" : "text-[#0A0626]"}`}>Custom Quote</p>;
  }
  const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="relative inline-flex overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={price}
              initial={{ opacity: 0, transform: "translateY(60%)" }}
              animate={{ opacity: 1, transform: "translateY(0%)", transition: { type: "spring", duration: 0.45, bounce: 0.2 } }}
              exit={{ opacity: 0, transform: "translateY(-60%)", transition: { duration: 0.15 } }}
              className={`text-[44px] font-medium leading-[52px] tracking-[-0.02em] ${dark ? "text-white" : "text-[#0A0626]"}`}
            >
              {rupees(price)}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className={`text-base ${dark ? "text-[#A9B3CC]" : "text-[#5F6062]"}`}>/ seat / month</span>
      </div>
      <p className={`mt-1 h-5 text-sm ${dark ? "text-[#A9B3CC]" : "text-[#6B6E75]"}`}>
        {isYearly && (
          <>
            <span className="mr-1.5 line-through opacity-70">{rupees(tier.monthlyPrice)}</span>
            billed annually
          </>
        )}
      </p>
    </div>
  );
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <>
        {/* --- HERO --- */}
        <section className="relative overflow-hidden bg-white bg-[radial-gradient(60%_55%_at_50%_0%,#EEF3FF,transparent)] px-4 pb-16 pt-16 text-center sm:pt-20">
          <nav style={delay(0)} className="cl-fade-up mb-6 flex items-center justify-center gap-1.5 text-xs text-[#6B6E75]">
            <Link className="transition-colors hover:text-primary" to="/">
              Home
            </Link>
            <ChevronRight size={13} />
            <span className="font-semibold text-[#31343A]">Pricing</span>
          </nav>

          <span
            style={delay(60)}
            className="cl-fade-up inline-flex h-10 items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 text-sm font-semibold text-[#31343a] shadow-[0_6px_16px_-10px_rgb(0_30_90/0.25)]"
          >
            <Sparkles size={15} className="text-[#F59E0B]" />
            Simple, Predictable Telephony Plans
          </span>

          <h1
            style={delay(120)}
            className="cl-fade-up mx-auto mt-6 max-w-4xl bg-gradient-to-r from-[#00B8FF] via-[#0047FF] to-[#2300DC] bg-clip-text text-[34px] font-medium leading-[1.15] text-transparent sm:text-5xl lg:text-[56px] lg:leading-[62px]"
          >
            Enterprise Telephony Sized for Your Scale
          </h1>
          <p style={delay(180)} className="cl-fade-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#404348]">
            Choose the plan that fits your business needs. Upgrade or scale your agent seats seamlessly with zero operational downtime.
          </p>

          {/* Billing toggle: a pill slides between the two intervals */}
          <div style={delay(240)} className="cl-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div role="group" aria-label="Billing interval" className="relative inline-flex rounded-full border border-[#E5EAF4] bg-[#F0F3FA] p-1">
              {[
                ["Monthly Billing", false],
                ["Annual Billing", true],
              ].map(([label, yearly]) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={isYearly === yearly}
                  onClick={() => setIsYearly(yearly)}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${isYearly === yearly ? "text-white" : "text-[#0A2A7A] hover:text-primary"}`}
                >
                  {isYearly === yearly && (
                    <motion.span
                      layoutId="billing-pill"
                      transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                      className="absolute inset-0 rounded-full bg-primary shadow-[0_6px_16px_-6px_rgb(0_51_153/0.6)]"
                    />
                  )}
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>
            <span className="rounded-full bg-[#E3F5EC] px-3 py-1 text-xs font-semibold uppercase tracking-[0.04em] text-[#0F7A4A]">Save 20%</span>
          </div>
        </section>

        {/* --- PLANS --- */}
        <section className="px-4 pb-20 pt-4 sm:px-6">
          <div className="mx-auto grid max-w-[1228px] items-stretch gap-6 lg:grid-cols-3">
            {PRICING_TIERS.map((tier, i) => {
              const dark = tier.highlight;
              const priced = typeof tier.monthlyPrice === "number";
              return (
                <div
                  key={tier.name}
                  style={delay(300 + i * 80)}
                  className={`cl-fade-up relative flex flex-col rounded-3xl p-8 transition-[box-shadow,border-color,translate] duration-300 hover:[translate:0_-4px] ${
                    dark
                      ? "bg-[#0A0626] text-white shadow-[0_30px_60px_-24px_rgb(0_51_153/0.6)] ring-1 ring-[#26366B] lg:-my-4 lg:py-12"
                      : "border border-[#E5E7EB] bg-white hover:border-primary/40 hover:shadow-[0_18px_40px_-20px_rgb(0_51_153/0.25)]"
                  }`}
                >
                  {dark && (
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(70%_50%_at_80%_0%,rgb(33_68_206/0.45),transparent)]" />
                  )}
                  <div className="relative flex items-start justify-between gap-3">
                    <h2 className={`text-xl font-medium ${dark ? "text-white" : "text-[#31343A]"}`}>{tier.name}</h2>
                    {tier.badge && (
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.04em] ${
                          dark ? "bg-[#8FB0FF] text-[#0B1330]" : "bg-[#EEF2FB] text-primary"
                        }`}
                      >
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <p className={`relative mt-3 text-[15px] leading-6 ${dark ? "text-[#B8C4E0]" : "text-[#4A4D53]"}`}>{tier.description}</p>

                  <div className={`relative my-7 border-y py-6 ${dark ? "border-white/10" : "border-[#EDEEEF]"}`}>
                    <Price tier={tier} isYearly={isYearly} dark={dark} />
                  </div>

                  <p className={`relative mb-4 text-xs font-semibold uppercase tracking-[0.08em] ${dark ? "text-[#8FB0FF]" : "text-[#183cbe]"}`}>
                    Included Capabilities
                  </p>
                  <ul className="relative flex-1 space-y-3.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className={`flex items-start gap-3 text-[15px] ${dark ? "text-[#D5DEF5]" : "text-[#31343A]"}`}>
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            dark ? "bg-[rgb(95_150_255/0.18)] text-[#8FB0FF]" : "bg-[#CFEDE3] text-[#0F7A4A]"
                          }`}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className={`relative mt-10 flex h-12 items-center justify-center gap-2 rounded-lg font-semibold transition-[background-color,transform] duration-200 hover:scale-[1.02] motion-reduce:hover:scale-100 ${
                      dark ? "bg-white text-primary hover:bg-[#EEF2FF]" : "bg-primary text-white hover:bg-[#001A4D]"
                    }`}
                  >
                    {priced ? "Get Started" : "Contact Sales"} <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- TRUST --- */}
        <section className="bg-[#F0F3FA] px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto grid max-w-[1228px] gap-5 md:grid-cols-3">
            {TRUST.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-[#E5EAF4] bg-white p-7 transition-colors hover:border-[#B8C5EE]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF2FB] text-primary">
                  <Icon size={24} />
                </span>
                <h3 className="mt-5 text-lg font-medium text-[#31343A]">{title}</h3>
                <p className="mt-2 text-[15px] leading-6 text-[#4A4D53]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <TrustBand />

        {/* --- FAQ --- */}
        <section className="flex flex-col items-center px-4 py-20 md:py-24">
          <span className="text-sm font-semibold uppercase text-[#183CBE]">Billing & Plans</span>
          <h2 className="mt-3 text-center text-[30px] font-medium text-[#2B2D36] xl:text-[45px]">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <Accordion type="single" collapsible defaultValue="faq-0" className="mx-auto mt-10 w-full max-w-[760px] space-y-3 md:mt-12">
            {PRICING_FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                className="rounded-2xl border border-[#ECECEC] bg-white px-5 transition-colors duration-200 hover:border-[#D5D9E3] data-[state=open]:border-primary md:px-6"
              >
                <AccordionTrigger className="gap-4 py-4 text-[15px] font-medium leading-snug text-[#2B2D36] hover:no-underline md:text-[16px] [&>svg]:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pr-8 text-[14px] leading-6 text-[#404348] md:pr-10 md:text-[15px]">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* --- CTA --- */}
        <section className="w-full bg-[linear-gradient(110deg,#2300DC_0%,#0047FF_55%,#0091FF_100%)]">
          <div className="mx-auto flex max-w-[1100px] flex-col items-center px-4 py-14 text-center md:py-[72px]">
            <h2 className="text-[28px] font-medium leading-[1.2] text-white md:text-[40px]">Need a custom quote for your contact center?</h2>
            <p className="mt-5 max-w-[720px] text-[15px] leading-7 text-[#DCE6FF] md:text-[17px]">
              Talk to our senior telephony architects for a customized breakdown according to your trunk lines and agent seats.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white bg-white px-7 font-semibold text-primary transition-colors hover:bg-[#EEF2FF]">
                Talk to Sales <ArrowRight size={16} />
              </Link>
              <a href={tel(CONTACT.sales)} className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-7 font-semibold text-white transition-colors hover:bg-white/10">
                Call {CONTACT.sales}
              </a>
            </div>
          </div>
        </section>
    </>
  );
}
