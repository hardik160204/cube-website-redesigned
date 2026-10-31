import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { useList } from "../../lib/editable";

//Cube's FAQ: one centred column of bordered rows; the open row's border turns brand blue.
const EXPERT_LINE = "+91 806 869 4440";

const FAQS = [
  { q: "What services does Cube Software provide?", a: "We offer a complete range of communication solutions including Cloud PBX, dialers (inbound/outbound/blended), voice loggers, screen loggers, IVRS, conference bridges, call billing software, voice mail systems, SIP trunking and CRM integrations." },
  { q: "Which cities do you support?", a: "We work with businesses across India — Bengaluru, Mumbai, Delhi, Gurugram, Noida, Ahmedabad, Pune and many more regions — and connect your local, 140 and 160 series lines from your operator." },
  { q: "Do you sell phone numbers?", a: "No. You keep the local, national, international DID, toll-free, vanity or 140/160 series numbers you get from your telecom operator, and our experts connect them to Cube for you." },
  { q: "How do we go live?", a: "Talk to our experts, connect your numbers through your operator's SIP or PRI lines or your existing PBX, and we configure your IVR, routing and recording before switching you over with no interruption to your calls. Your operator may ask for documents in some states under local telecom regulations." },
  { q: "Do you support call forwarding and IVR?", a: "Yes. Our platform supports IVR menus, smart call routing, call forwarding, time-based routing, ring groups, voicemail, call recording and auto attendants." },
  { q: "Can your services work with my existing dialers or PBX?", a: "Yes. Our SIP trunking and VoIP solutions are compatible with most major PBX platforms including Asterisk, FreePBX, 3CX, Grandstream and Cisco systems." },
  { q: "Do you provide CRM integrations?", a: "Yes. We integrate with popular CRMs and tools including customized CRMs, Salesforce, Freshdesk and custom applications through our APIs and CTI connectors." },
  { q: "Is your platform suitable for call centers?", a: "Yes. Our platform is built for BPOs, call centers, support teams, sales teams and remote workforces, delivering high-quality calls, intelligent routing and enterprise-grade scalability." },
  { q: "How do I get started?", a: "Getting started is easy. Contact our sales team or request a demo through our website. Our experts will help you choose the right solution based on your business needs, call volume, and future growth." },
];

// Pages pass their own questions and heading; the homepage uses the defaults.
export default function Faq({ items: builtIn = FAQS, label = "FAQ", title = "Questions,", highlight = "answered.", id = "faq" }) {
  const { items, mark } = useList("faq", builtIn);
  return (
    <section id={id} className="flex scroll-mt-32 flex-col items-center px-4 pb-20 pt-16 md:pt-24">
      <span className="text-center text-sm font-semibold uppercase text-[#0047FF]">{label}</span>
      <h2 className="mt-3 text-center text-[30px] font-medium text-[#2B2D36] xl:text-[45px]">
        {title} <span className="text-primary">{highlight}</span>
      </h2>
      <p className="mt-4 text-center text-base text-[#404348] md:text-lg">
        Can't find what you need? Talk to someone who has been doing telephony for 35 years:{" "}
        <a href={`tel:${EXPERT_LINE.replace(/\s/g, "")}`} className="whitespace-nowrap font-semibold text-primary hover:underline">
          {EXPERT_LINE}
        </a>
        .
      </p>

      <Accordion {...mark} type="single" collapsible defaultValue="faq-0" className="mx-auto mt-10 w-full max-w-[760px] space-y-3 md:mt-12">
        {items.map((faq, i) => (
          <AccordionItem
            key={`${i}-${faq.q}`}
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
  );
}
