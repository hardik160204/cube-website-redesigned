import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Database, Layers, Plug } from "lucide-react";
import SectionIntro from "./SectionIntro";

// The four integrations Cube leads with. Each line comes from the site's own copy.
const INTEGRATIONS = [
  { name: "APIs & CTI", kind: "Connectors", icon: Code2, line: "Bring calls into the applications you already run." },
  { name: "Salesforce", kind: "CRM", icon: Database, line: "Native connectors for Salesforce, with screen-pops for every call." },
  { name: "Custom CRM", kind: "CRM", icon: Layers, line: "Your own CRM, connected through our APIs and CTI connectors." },
  { name: "Freshdesk", kind: "CRM", icon: Plug, line: "Plug into Freshdesk through clean, well-documented APIs." },
];

export default function Integrations() {
  return (
    <section id="integrations" className="bg-[#F0F3FA] px-4 py-[60px] md:py-24">
      <div className="mx-auto w-full max-w-[1228px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            label="Integrations"
            title="Bring calls into the"
            highlight="applications you already run."
            body="We integrate with popular CRMs and tools including customized CRMs, Salesforce, Freshdesk and custom applications through our APIs and CTI connectors."
          />
          <Link
            to="/services/crm-integration"
            className="group inline-flex h-[43px] shrink-0 items-center gap-2 self-start rounded-lg border border-[#E5EAF4] bg-white px-5 text-base font-medium text-primary transition hover:bg-[#F7FAFF] lg:self-auto"
          >
            Explore CRM Integration <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INTEGRATIONS.map(({ name, kind, icon: Icon, line }) => (
            <li key={name}>
              <Link
                to="/services/crm-integration"
                className="group flex h-full flex-col rounded-[24px] border border-[#E5EAF4] bg-white p-6 transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:border-[#99B5FF] hover:shadow-[0_24px_50px_-28px_rgb(0_71_255/0.45)] hover:[translate:0_-4px]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#00B8FF,#0047FF)] text-white shadow-[0_12px_24px_-12px_rgb(0_71_255/0.8)]">
                    <Icon size={22} />
                  </span>
                  <span className="rounded-full bg-[#F0F3F9] px-2.5 py-0.5 text-xs font-medium text-[#4A4D53]">{kind}</span>
                </div>
                <p className="mt-5 text-xl font-medium text-[#0A0626]">{name}</p>
                <p className="mt-2 flex-1 text-[15px] leading-6 text-[#4A4D53]">{line}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Learn more <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
