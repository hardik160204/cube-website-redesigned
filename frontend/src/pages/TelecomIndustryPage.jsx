import React from "react";
import { BarChart3, Cpu, Globe, Network, Server, ShieldCheck } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    label: "Telecom",
    title: <>{"Carrier-Grade "}<Hi>Infrastructure</Hi></>,
    body: [
      "Powering the backbone of modern communication. We provide telecom operators and ISPs with high-capacity routing, SIP trunking, and advanced billing software.",
    ],
    image: "/telecom-industry-page.svg", imageAlt: "Telecom Infrastructure",
    button: "Book a Demo",
  },
  {
    label: "35+ Years of Telephony Excellence",
    title: "Engineered for massive scale",
    cards: [
      { icon: Network, title: "Carrier-Grade SIP Trunking", desc: "Robust, high-capacity SIP trunks designed to handle thousands of concurrent calls with 99.99% uptime." },
      { icon: BarChart3, title: "Advanced Call Billing", desc: "Deploy sophisticated call billing software to track telecom resources, generate invoices, and manage tariffs accurately." },
      { icon: Server, title: "Custom IVRS Solutions", desc: "Build complex, multi-level IVR systems from scratch tailored perfectly to your network infrastructure." },
      { icon: ShieldCheck, title: "Regulatory Compliance", desc: "Home-grown software trusted since 1990, built to comply with stringent national telecom regulations and standards." },
    ],
  },
  {
    title: "Unmatched reliability for service providers.",
    list: [
      "High-Capacity SIP Trunking & PRI Lines",
      "Advanced Voice Logger Integrations",
      "Scalable Cloud PBX Architectures",
      "White-label Solutions for Resellers",
    ],
    cards: [
      { icon: Cpu, title: "Hardware Agnostic", desc: "Compatible with major PBX platforms like Asterisk, 3CX, Cisco, and Grandstream." },
      { icon: Globe, title: "Global Connectivity", desc: "Provide DID, toll-free, and vanity numbers across local and international markets seamlessly." },
    ],
  },
];

export default function TelecomIndustryPage() {
  return <FlexPage sections={SECTIONS} related />;
}
