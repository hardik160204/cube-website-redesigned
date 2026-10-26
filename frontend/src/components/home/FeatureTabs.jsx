import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import FlowChart from "./FlowChart";
import { FEATURE_FLOWS } from "./feature-flows";
import SectionIntro from "./SectionIntro";

// Cube telephony-features block: category pills, then an accordion whose open row fills a 6s progress bar
// and hands over to the next row, beside an animated flowchart of how that feature works (feature-flows.js).
// Every feature is one the site lists.
const TABS = [
  {
    label: "Inbound",
    features: [
      { title: "IVR menus", desc: "Multi-level menus that greet, qualify and steer callers.", href: "/services/ivr" },
      { title: "Smart call routing", desc: "Route by skill, language or business value.", href: "/services/smart-call-routing" },
      { title: "Time-based routing", desc: "Different flows for business hours, nights and holidays.", href: "/services/smart-call-routing" },
      { title: "Ring groups", desc: "Ring a whole team at once or one after another.", href: "/services/cloud-contact-center" },
      { title: "Auto attendant", desc: "Greet and direct callers without a receptionist.", href: "/services/ivrs" },
      { title: "Voicemail", desc: "Messages captured and delivered when nobody can pick up.", href: "/services/voice-mail" },
    ],
  },
  {
    label: "Outbound",
    features: [
      { title: "Predictive dialing", desc: "Plus progressive and preview modes for every campaign.", href: "/services/auto-dialer" },
      { title: "Bulk voice calls", desc: "Record once and deliver to your whole list.", href: "/services/bulk-voice-call" },
      { title: "Click to call", desc: "Callbacks requested straight from your website.", href: "/services/click-to-call" },
      { title: "Missed-call campaigns", desc: "Turn a missed call into a lead or an opt-in.", href: "/services/missed-call" },
      { title: "Call disposition", desc: "Tag every call's outcome for clean reporting.", href: "/services/ai-contact-center" },
      { title: "Blended campaigns", desc: "Inbound and outbound on the same agent floor.", href: "/services/ai-contact-center" },
    ],
  },
  {
    label: "Recording & QA",
    features: [
      { title: "Call recording", desc: "SIP, analog or digital lines — compressed and searchable.", href: "/services/voice-logger" },
      { title: "Screen recording", desc: "Multi-PC screen capture synced with the audio.", href: "/services/screen-logger" },
      { title: "Multi-site sync", desc: "InSync centralises recordings from every location.", href: "/services/voice-logger-insync" },
      { title: "Quality analysis", desc: "Score and review calls to coach your team.", href: "/services/quality-analysis" },
      { title: "Live analytics", desc: "Queues, answer rates and waits as they happen.", href: "/services/live-analytics" },
      { title: "Supervisor wallboards", desc: "Live visibility for every team lead.", href: "/services/live-analytics" },
    ],
  },
  {
    label: "Integrations",
    features: [
      { title: "CRM integration", desc: "Salesforce, Freshdesk or your own CRM.", href: "/services/crm-integration" },
      { title: "APIs & CTI connectors", desc: "Bring calls into the applications you already run.", href: "/services/crm-integration" },
      { title: "PBX compatibility", desc: "Asterisk, FreePBX, 3CX, Grandstream and Cisco.", href: "/services/cloud-contact-center" },
      { title: "SIP trunking", desc: "Move off legacy lines without replacing your PBX.", href: "/services/cloud-contact-center" },
      { title: "Number masking", desc: "Real numbers stay private on both sides of a call.", href: "/services/number-masking" },
      { title: "WhatsApp & web chat", desc: "Chat lands in the same omnichannel contact center.", href: "/services/whatsapp-bot" },
    ],
  },
];

export default function FeatureTabs() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(0);
  const tabRefs = useRef([]);
  const features = TABS[tab].features;

  const selectTab = (i) => {
    setTab(i);
    setOpen(0);
  };
  // When the open row's bar finishes, the next row opens; after the last row, the next tab begins.
  const advance = () => {
    if (open < features.length - 1) setOpen(open + 1);
    else selectTab((tab + 1) % TABS.length);
  };
  const onTabKey = (e) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (tab + delta + TABS.length) % TABS.length;
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="features" className="scroll-mt-32 bg-[#F0F3FA] px-4 py-14 md:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionIntro
          label="Features"
          title="Every feature your"
          highlight="call flow needs."
          body="Inbound, outbound, recording and integrations — configured for the way your team works."
          className="max-w-[800px]"
        />

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Feature groups" onKeyDown={onTabKey} className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
            {TABS.map((t, i) => (
              <button
                key={t.label}
                ref={(el) => (tabRefs.current[i] = el)}
                type="button"
                role="tab"
                id={`feature-tab-${i}`}
                aria-selected={i === tab}
                aria-controls="feature-panel"
                tabIndex={i === tab ? 0 : -1}
                onClick={() => selectTab(i)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-[9px] text-[15px] font-medium transition-colors ${
                  i === tab ? "border-primary bg-primary text-white" : "border-[#E5EAF4] bg-white text-[#2300DC] hover:border-[#99B5FF]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <Link to="/services/ai-contact-center" className="group inline-flex items-center gap-2 text-[17px] font-medium text-primary">
            Explore Contact Center Solution
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div id="feature-panel" role="tabpanel" aria-labelledby={`feature-tab-${tab}`} className="cl-features mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:min-h-[480px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:gap-10">
          <div className="flex flex-col gap-2.5">
            {features.map((f, i) => {
              const isOpen = i === open;
              return (
                <div
                  key={`${tab}-${f.title}`}
                  className={`relative overflow-hidden rounded-2xl border transition-[background-color,border-color,box-shadow] duration-300 ${
                    isOpen ? "border-[#D6E2FF] bg-white shadow-[0_18px_40px_-24px_rgb(0_71_255/0.45)]" : "border-transparent bg-white/60 hover:bg-white"
                  }`}
                >
                  {isOpen && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#00B8FF] to-[#0047FF]" />}
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(i)}
                    className="flex w-full items-center gap-4 px-[22px] py-[15px] text-left"
                  >
                    <span className={`font-mono text-xs tabular-nums ${isOpen ? "text-primary" : "text-[#9CA3AF]"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 className={`flex-1 text-[18px] font-medium leading-7 md:text-[20px] ${isOpen ? "text-[#0A0626]" : "text-[#3B414A]"}`}>{f.title}</h3>
                    <ChevronDown size={20} className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : "text-[#3B414A]"}`} />
                  </button>
                  {isOpen && (
                    <>
                      <div className="relative mx-[22px] h-[2px] overflow-hidden rounded-full bg-[#ECEFF3]">
                        <div key={`${tab}-${i}`} onAnimationEnd={advance} className="cl-progress absolute left-0 top-0 h-[2px] bg-gradient-to-r from-[#00B8FF] to-[#0047FF]" />
                      </div>
                      <div className="cl-describe px-[22px] pb-5 pt-4">
                        <p className="text-base leading-[140%] text-[#4A4D53]">{f.desc}</p>
                        <Link to={f.href} className="group mt-4 inline-flex items-center gap-2 text-base font-medium text-primary">
                          Learn more <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <FlowChart key={f.title} stages={FEATURE_FLOWS[f.title]} title={f.title} className="mt-5 lg:hidden" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <FlowChart key={features[open].title} stages={FEATURE_FLOWS[features[open].title]} title={features[open].title} className="hidden lg:sticky lg:top-36 lg:flex lg:min-h-[480px]" />
        </div>
      </div>
    </section>
  );
}
