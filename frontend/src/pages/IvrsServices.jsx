import React from "react";
import {
  AudioLines, Database, MessageSquare, PhoneOutgoing, Languages, BarChart3, Plug, ShieldCheck, Headphones, BrainCircuit,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";

// =========================================================================
// IVRS SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "IVRS Services",
  tagline: "Custom IVR solutions built from scratch with the latest software, database and telecom technologies.",
  heroVideo: "/ivrs-bg.mp4", // <-- UPDATE THIS TO YOUR VIDEO FILE NAME
  overviewImage: "/IVRS.png", // <-- UPDATE THIS TO YOUR LEFT-SIDE OVERVIEW IMAGE
  stats: [
    { value: "70%", label: "Calls Self-Served" },
    { value: "Custom", label: "Built for You" },
    { value: "DB-Live", label: "Data Integration" },
  ],
  overview: [
    "We build IVR solutions from the ground up using modern software, database technologies and telecom signalling methodologies — not cookie-cutter menus. Your IVR speaks to your actual databases, so callers hear live balances, order status and appointment slots, not canned messages.",
    "From simple auto-attendants to multi-level transactional IVRs with payment capture, outbound reminder blasts and speech input, Cube designs, records, deploys and maintains the entire flow — on-premise or hosted.",
  ],
  features: [
    { icon: AudioLines, title: "Custom Call Flows", description: "Menus designed around your process — unlimited levels and branches." },
    { icon: Database, title: "Live Database Lookups", description: "Read and write to SQL/ERP systems mid-call for real answers." },
    { icon: MessageSquare, title: "Speech & DTMF Input", description: "Callers speak or key in choices — both handled natively." },
    { icon: PhoneOutgoing, title: "Outbound IVR Blasts", description: "Automated reminders, alerts and surveys at scale." },
    { icon: Languages, title: "Multi-Language Voice", description: "Professional prompt recording in the languages you need." },
    { icon: BarChart3, title: "Flow Analytics", description: "See where callers drop, transfer or self-serve to keep improving." },
  ],
  benefits: [
    "Deflect up to 70% of routine calls from agents",
    "Serve customers 24/7 without extra headcount",
    "Consistent, professional caller experience",
    "Built from scratch — fits your exact process",
    "Integrates with dialer, CRM and billing systems",
    "Domestic and international deployment options",
  ],
  useCases: ["Bank balance & OTP lines", "Order & delivery status", "Appointment reminders", "Government helplines"],
  faqs: [
    { q: "What is an IVRS (Interactive Voice Response System)?", a: "IVRS is an automated telephony system that interacts with callers, gathers information, and routes calls to the appropriate recipient or self-service application using voice prompts and touch-tone keypad selections." },
    { q: "Can the IVR system connect to our live databases (CRM/ERP)?", a: "Yes, our IVRS natively reads and writes to SQL, ERP, and CRM systems mid-call, allowing callers to hear live account balances, order statuses, or appointment slots instead of static, canned messages." },
    { q: "Do you support multi-language IVR menus?", a: "Absolutely. We support multi-language voice prompts, allowing you to serve a diverse customer base by providing professional recordings in the languages your callers prefer." },
    { q: "What is the difference between DTMF and Speech Input?", a: "DTMF (Dual-Tone Multi-Frequency) requires callers to press keypad buttons (e.g., 'Press 1 for Sales'), whereas Speech Input uses advanced voice recognition to allow callers to simply speak their choices." },
    { q: "Can the IVR system handle outbound calls as well?", a: "Yes. Our solution supports outbound IVR blasts, enabling you to automate reminders, alerts, OTP deliveries, and customer surveys at scale without requiring manual agent intervention." },
    { q: "Is it possible to integrate the IVR with our existing PBX or contact center?", a: "Yes, our custom IVR solutions are designed to seamlessly integrate with most modern dialers, CRMs, billing systems, and existing PBX infrastructure, whether deployed on-premise or in the cloud." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Enterprise Security", description: "Encrypted protocols, fraud monitoring and hardened infrastructure that protect every conversation your teams have." },
  { icon: Plug, title: "CRM Integration", description: "Plug into Salesforce, Zoho, Freshdesk, or custom CRMs for instant caller screen-pops." },
  { icon: Headphones, title: "24/7 Support", description: "Never skip a beat. Secure 24/7 dedicated support for your critical outbound campaigns." },
  { icon: BrainCircuit, title: "AI Call Management", description: "Elevate your team with smart routing algorithms, sentiment analysis, and automated QA." },
];

export default function IvrsServices() {
  return <ProductPage data={PAGE_DATA} enterprise={ENTERPRISE_FEATURES} crumb="Services" highlight="IVR Solutions" />;
}
