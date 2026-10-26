import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw, Server, ShieldCheck } from "lucide-react";
import { PRICING_TIERS } from "../../pages/PricingPage";

// Cube plan strip, filled from the pricing page: annual seat prices, then the page's three guarantees.
const GUARANTEES = [
  { icon: ShieldCheck, label: "100% Encrypted & Compliant" },
  { icon: RefreshCw, label: "Zero Downtime Migration" },
  { icon: Server, label: "On-Premise or Cloud" },
];
const rupees = (n) => `Rs. ${n.toLocaleString("en-IN")}`;

export default function PricingStrip() {
  return (
    <section id="pricing" className="scroll-mt-32 bg-white px-4 py-[60px] md:pb-24 lg:pl-[150px] lg:pr-[108px]">
      <div className="mx-auto w-full max-w-[1228px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-[900px] flex-col gap-3">
            <h2 className="text-[32px] font-medium leading-[1.15] text-[#31343A] md:text-[45px] md:leading-[52px]">Enterprise Telephony Sized for Your Scale</h2>
            <p className="text-lg leading-7 text-[#404348]">
              Choose the plan that fits your business needs. Upgrade or scale your agent seats seamlessly with zero operational downtime.
            </p>
          </div>
          <Link to="/pricing" className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-base font-medium text-primary hover:underline">
            Compare plans <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => {
            const priced = typeof tier.yearlyPrice === "number";
            return (
              <Link
                key={tier.name}
                to="/pricing"
                className="flex flex-col gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-7 pb-[26px] pt-7 transition hover:border-primary/40 hover:shadow-[0_8px_24px_rgb(0_71_255/0.08)]"
              >
                <span className="flex items-center justify-between gap-3 text-base font-medium leading-6 text-[#31343A]">
                  {tier.name}
                  {tier.badge && <span className="rounded-full bg-[#E6EEFF] px-2.5 py-0.5 text-xs font-semibold uppercase text-primary">{tier.badge}</span>}
                </span>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[40px] font-medium leading-[48px] text-[#31343A]">{priced ? rupees(tier.yearlyPrice) : "Custom Quote"}</span>
                  {priced && <span className="text-base leading-6 text-[#5F6062]">/ seat / month, annual billing</span>}
                </div>
                <p className="mt-1 text-base leading-6 text-[#404348]">{tier.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#D9DEEA] bg-[#F0F3F9] px-5 py-[18px] lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-7">
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
            <span className="inline-flex h-9 items-center whitespace-nowrap rounded-full bg-primary px-3.5 text-base font-semibold leading-6 text-white">Save 20%</span>
            <span className="whitespace-nowrap text-lg font-medium leading-[26px] text-[#31343A]">with annual billing</span>
          </div>
          <span className="hidden h-8 w-px shrink-0 bg-[#C9D6F2] lg:block" />
          <div className="flex flex-wrap items-center gap-2.5">
            {GUARANTEES.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex h-10 items-center gap-2 rounded-full border border-[#D9DEEA] bg-white px-4 text-[15px] leading-[22px] text-[#31343A]">
                <Icon size={16} className="text-primary" /> {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
