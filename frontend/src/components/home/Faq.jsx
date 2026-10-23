import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { MagneticLink } from "../ui/magnetic-link";
import { useSpotlight } from "../../hooks/use-pointer-motion";
import { inView, reveal } from "../../lib/motion";
import SectionIntro from "./SectionIntro";

const EXPERT_LINE = "+91 806 869 4440";

const FAQS = [
  { q: "What services does Cube Software provide?", a: "We offer a complete range of communication solutions including Cloud PBX, dialers (inbound/outbound/blended), voice loggers, screen loggers, IVRS, conference bridges, call billing software, voice mail systems, SIP trunking and CRM integrations." },
  { q: "Which cities do you support?", a: "We provide numbers and voice solutions across India — Bengaluru, Mumbai, Delhi, Gurugram, Noida, Ahmedabad, Pune and many more regions — along with 140 and 160 series lines." },
  { q: "Can I get local and toll-free numbers?", a: "We provide local, national, international DID, toll-free, and vanity numbers to meet your business and market requirements." },
  { q: "How quickly can numbers be activated?", a: "Most numbers are activated within minutes after verification and payment. Some states may require documentation based on local telecom regulations." },
  { q: "Do you support call forwarding and IVR?", a: "Yes. Our platform supports IVR menus, smart call routing, call forwarding, time-based routing, ring groups, voicemail, call recording and auto attendants." },
  { q: "Can your services work with my existing dialers or PBX?", a: "Yes. Our SIP trunking and VoIP solutions are compatible with most major PBX platforms including Asterisk, FreePBX, 3CX, Grandstream and Cisco systems." },
  { q: "Do you provide CRM integrations?", a: "Yes. We integrate with popular CRMs and tools including customized CRMs, Salesforce, Freshdesk and custom applications through our APIs and CTI connectors." },
  { q: "Is your platform suitable for call centers?", a: "Yes. Our platform is built for BPOs, call centers, support teams, sales teams and remote workforces, delivering high-quality calls, intelligent routing and enterprise-grade scalability." },
  { q: "How do I get started?", a: "Getting started is easy. Contact our sales team or request a demo through our website. Our experts will help you choose the right solution based on your business needs, call volume, and future growth." },
];

function FaqItem({ faq, index, variants }) {
  const spot = useSpotlight();
  return (
    <motion.div variants={variants} custom={index}>
      <AccordionItem
        value={`faq-${index}`}
        {...spot.handlers}
        className="group/spot relative mb-3 rounded-2xl border border-border bg-card px-6 shadow-card transition-shadow duration-200 hover:shadow-elevated data-[state=open]:shadow-elevated"
      >
        {spot.glow}
        <AccordionTrigger className="relative py-5 text-left font-heading text-[17px] font-semibold text-foreground hover:text-primary hover:no-underline">
          {faq.q}
        </AccordionTrigger>
        <AccordionContent className="relative pb-5 leading-relaxed text-muted-foreground">{faq.a}</AccordionContent>
      </AccordionItem>
    </motion.div>
  );
}

export default function Faq() {
  // Questions rise into place top to bottom, 40ms apart.
  const item = reveal(useReducedMotion(), "translateY(24px)", "translateY(0px)", 0.04);

  return (
    <section id="faq" className="scroll-mt-28 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* The question column stays put while the answers scroll past it */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionIntro
            label="FAQ"
            title="Questions, answered."
            body="Can't find what you need? Talk to someone who has been doing telephony for 35 years."
          />
          <MagneticLink
            to={`tel:${EXPERT_LINE.replace(/\s/g, "")}`}
            variant="outline"
            className="mt-8 h-12 rounded-full bg-card px-6 text-[15px] text-foreground shadow-card hover:bg-card hover:text-foreground hover:shadow-elevated"
          >
            <Phone /> {EXPERT_LINE}
          </MagneticLink>
        </div>

        <motion.div {...inView}>
          <Accordion type="single" collapsible>
            {FAQS.map((faq, i) => (
              <FaqItem key={faq.q} faq={faq} index={i} variants={item} />
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
