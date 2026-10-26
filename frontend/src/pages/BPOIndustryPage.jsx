import React from "react";
import { Activity, BarChart, Database, Mic, PhoneForwarded, Users } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    label: "BPO & Call Centers",
    title: <>{"Maximize Agent "}<Hi>Productivity</Hi></>,
    body: [
      "Handle massive call volumes efficiently with advanced predictive dialers, voice logging, and real-time monitoring built for outsourcing floors of every size.",
    ],
    image: "/bpo-call-center-page.svg", imageAlt: "BPO Cloud Telephony Live Monitor",
    button: "Book a Demo",
  },
  {
    label: "Why BPOs Trust Cube Software",
    title: "Engineered for high-volume performance",
    cards: [
      { icon: PhoneForwarded, title: "Predictive Auto-Dialing", desc: "Eliminate manual dialing. Our algorithms filter out voicemails and busy signals to keep agents talking." },
      { icon: Activity, title: "Real-Time Monitoring", desc: "Live supervisor wallboards to barge-in, whisper, and monitor agent performance across campaigns." },
      { icon: Mic, title: "100% Call Recording", desc: "Automatically log and compress all calls for quality assurance, training, and compliance purposes." },
      { icon: Database, title: "Seamless CRM Sync", desc: "Integrate directly with your existing CRM so agents have customer data on-screen before they even say hello." },
    ],
  },
  {
    title: "Scale your operations without the hardware limits.",
    list: [
      "Inbound, Outbound & Blended Campaigns",
      "Automated Skill-Based Call Routing",
      "Remote Agent & WFH Support",
      "Detailed Shift & Campaign Analytics",
    ],
    cards: [
      { icon: Users, title: "Lead Generation", desc: "Connect faster with prospects using intelligent auto-dialing engines." },
      { icon: BarChart, title: "Quality Assurance", desc: "Review live calls and logs to ensure agents meet compliance and quality scores." },
    ],
  },
];

export default function BPOIndustryPage() {
  return <FlexPage sections={SECTIONS} related />;
}
