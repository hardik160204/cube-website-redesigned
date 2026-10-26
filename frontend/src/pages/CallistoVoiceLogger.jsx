import React from "react";
import {
  Mic, FileAudio, Search, HardDrive, Lock, Bell, ShieldCheck, Plug, Headphones, BrainCircuit,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";

// =========================================================================
// CALLISTO VOICE LOGGER SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Callisto Voice Logger",
  tagline: "The ideal call recording solution — every conversation captured, compressed and searchable.",
  heroVideo: "/blue-voice.mp4", // <-- UPDATE THIS TO YOUR EXACT VIDEO FILE NAME IN THE PUBLIC FOLDER
  overviewImage: "/callisto-overview.png", // <-- ADDED FOR 2-COLUMN LAYOUT CONSISTENCY
  stats: [
    { value: "All", label: "Analog/PRI/SIP" },
    { value: "90%", label: "Storage Savings" },
    { value: "100%", label: "Call Capture" },
  ],
  overview: [
    "Callisto Voice Logger records every call across your organisation — analog lines, PRI trunks or SIP — with crystal clarity and minimal storage footprint. Recordings are indexed by date, extension, caller ID and disposition so any conversation is retrievable in seconds.",
    "Designed for compliance-heavy industries, Callisto supports multiple formats including VOX and MP3, tamper-evident archives, role-based playback permissions and automatic retention policies. It is the recording backbone trusted by banks, hospitals and contact centers for decades.",
  ],
  features: [
    { icon: Mic, title: "Multi-Protocol Capture", description: "Record Analog, PRI, E1/T1 and SIP simultaneously on one server." },
    { icon: FileAudio, title: "Multiple Formats", description: "VOX, MP3, WAV and more — tuned for quality vs. storage." },
    { icon: Search, title: "Instant Retrieval", description: "Search by number, extension, time, duration or custom tags." },
    { icon: HardDrive, title: "Minimal Storage", description: "Advanced compression stores years of audio on modest disks." },
    { icon: Lock, title: "Tamper-Proof Archive", description: "Checksummed, encrypted recordings with full audit logs." },
    { icon: Bell, title: "Live Monitoring & Alerts", description: "Listen live, flag calls and trigger alerts on keywords or silence." },
  ],
  benefits: [
    "Meet regulatory recording mandates effortlessly",
    "Resolve customer disputes with indisputable evidence",
    "Coach agents using real call examples",
    "Requires minimal storage space and hardware",
    "Scales from 4 to 1,000+ recording channels",
    "Integrates with dialer, CRM and quality tools",
  ],
  useCases: ["Banking & trading desks", "Emergency & helpline services", "Contact center QA", "Legal & compliance teams"],
  faqs: [
    { q: "What types of lines can Callisto Voice Logger record?", a: "Callisto can seamlessly record Analog lines, PRI trunks, E1/T1, and SIP trunks simultaneously on a single server without needing separate hardware." },
    { q: "Are the recordings secure and tamper-proof?", a: "Yes, all recordings are encrypted and checksummed to create a tamper-evident archive, making them fully compliant for legal, financial, and regulatory audits." },
    { q: "How much storage space do I need?", a: "Callisto uses advanced compression algorithms that reduce storage requirements by up to 90%, allowing you to store years of high-quality audio on standard, modest hard drives." },
    { q: "Can I search for a specific recording easily?", a: "Absolutely. Recordings are indexed by caller ID, extension, date, time, and custom tags, allowing you to retrieve any conversation in seconds." },
    { q: "Does it support live monitoring for QA teams?", a: "Yes, supervisors have the ability to monitor ongoing calls in real-time, flag specific conversations, and even receive alerts based on predefined criteria like silence or keywords." },
    { q: "Is it easy to integrate with my CRM or dialer?", a: "Yes, Callisto integrates smoothly with major CRMs, auto dialers, and PBX systems through our robust APIs, ensuring seamless workflows across your communications stack." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Enterprise Security", description: "Encrypted protocols, fraud monitoring and hardened infrastructure that protect every conversation your teams have." },
  { icon: Plug, title: "CRM Integration", description: "Plug into Salesforce, Zoho, Freshdesk, or custom CRMs for instant caller screen-pops." },
  { icon: Headphones, title: "24/7 Support", description: "Never skip a beat. Secure 24/7 dedicated support for your critical recording infrastructure." },
  { icon: BrainCircuit, title: "Smart Archiving", description: "Elevate your team with smart retention policies, easy exporting, and automated QA hooks." },
];

export default function CallistoVoiceLogger() {
  return <ProductPage data={PAGE_DATA} enterprise={ENTERPRISE_FEATURES} highlight="Call Recording" overviewImage="/products/voice-logger.jpg" />;
}
