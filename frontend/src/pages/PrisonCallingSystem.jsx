import React from "react";
import {
  AudioLines, ShieldCheck, Globe, Landmark, PhoneIncoming, ListChecks, Database, Mic, Search, Percent, AlertTriangle, FileSpreadsheet, Clock, Eye, Headphones, UserCheck, PhoneOff,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";
import { HeroScene } from "../components/page/HeroScenes";

// =========================================================================
// PRISON CALLING SYSTEM SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Secure Prison Calling System",
  tagline: "Compliance-driven, highly secure inmate communication solutions with real-time monitoring, restricted dialing, and automated billing.",
  heroVideo: "/prison-calling-image.png", 
  stats: [
    { value: "100%", label: "Monitored Calls" },
    { value: "Secure", label: "Voice Biometrics" },
    { value: "Prepaid", label: "Wallet System" },
  ],
  overview: [
    "Our Secure Prison Calling System is engineered specifically for correctional facilities, focusing on absolute security, compliance, and controlled communications. Facility administrators have total oversight over every second of call time.",
    "The system enforces strict whitelisted phone directories, advanced voice biometric verification to prevent identity swapping, real-time keyword monitoring, and seamless prepaid wallet integrations for inmates and their families."
  ],
  features: [
    { icon: ShieldCheck, title: "Whitelisted Dialing", description: "Inmates can only call pre-approved, verified numbers (family and legal counsel)." },
    { icon: Mic, title: "Voice Biometrics", description: "Continuous voice authentication ensures the authorized inmate stays on the line." },
    { icon: AudioLines, title: "Live Monitoring & Whisper", description: "Wardens can silently monitor live calls, barge in, or terminate connections instantly." },
    { icon: Search, title: "Keyword Detection", description: "AI transcripts flag illicit keywords in real-time and alert facility staff." },
    { icon: Clock, title: "Schedule Restrictions", description: "Automated lockouts during unauthorized hours or disciplinary periods." },
    { icon: Landmark, title: "Prepaid Billing", description: "Integrated wallet system allowing families to easily fund inmate calling accounts." },
  ],
  benefits: [
    "Zero unauthorized external communications",
    "Automated recording and deep-archiving of all calls",
    "Eliminate manual billing with automated prepaid deductions",
    "Protect legal privilege with strictly unrecorded attorney lines",
    "Instantly flag suspicious activity with AI keyword detection",
    "Highly durable, tamper-proof hardware compatibility"
  ],
  useCases: ["State & Federal Prisons", "County Jails", "Juvenile Detention Centers", "Immigration Holding Facilities"],
  faqs: [
    { q: "How are calls restricted?", a: "Each inmate is assigned a PIN and a specific whitelist of numbers. If a number is not on their approved list, the system blocks the call instantly." },
    { q: "Can families add funds easily?", a: "Yes, our system includes a secure web portal and IVR where families can deposit funds directly into an inmate's prepaid calling wallet." },
    { q: "Are attorney calls recorded?", a: "No. Numbers designated as legal counsel are automatically routed through unrecorded, private channels to maintain attorney-client privilege." },
    { q: "What happens if inmates try to share PINs?", a: "Our continuous voice biometric scanning verifies the speaker's voice against their profile. If a different voice is detected, the call can be flagged or disconnected." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Absolute Security", description: "Military-grade encryption and hardened infrastructure designed to prevent tampering and unauthorized access." },
  { icon: Database, title: "Evidentiary Archiving", description: "Secure, unalterable call recording storage formatted specifically for legal and investigative retrieval." },
  { icon: AlertTriangle, title: "Threat Alerts", description: "Automated SMS or email alerts to staff when specific keywords or blacklisted numbers are detected." },
  { icon: UserCheck, title: "Identity Verification", description: "Multi-factor PIN and biometric authentication guarantees the identity of the caller on every interaction." },
];

const MODULES_DATA = [
  {
    id: "security",
    iconColor: "text-red-600",
    icon: ShieldCheck,
    title: "Security & Access Control",
    items: [
      { text: "Strict whitelisted directory enforcement", icon: ListChecks },
      { text: "Voice biometric identification and continuous scanning", icon: Mic },
      { text: "Three-way call detection and prevention", icon: PhoneOff },
      { text: "Automated time-of-day access schedules", icon: Clock },
    ]
  },
  {
    id: "monitoring",
    iconColor: "text-blue-600",
    icon: Eye, 
    title: "Surveillance & Monitoring",
    items: [
      { text: "Live call monitoring with silent whisper mode", icon: Headphones },
      { text: "Real-time AI transcription and keyword flagging", icon: Search },
      { text: "Instant call termination controls for staff", icon: AlertTriangle },
      { text: "Detailed forensic search for historical call logs", icon: Database },
    ]
  },
  {
    id: "billing",
    iconColor: "text-emerald-500",
    icon: Landmark,
    title: "Wallet & Billing Management",
    items: [
      { text: "Automated per-minute prepaid deductions", icon: Percent },
      { text: "Secure online deposit portal for families", icon: Globe },
      { text: "Low-balance IVR warnings during active calls", icon: PhoneIncoming },
      { text: "Comprehensive financial reporting for facility admins", icon: FileSpreadsheet },
    ]
  }
];

export default function PrisonCallingSystem() {
  return (
    <ProductPage
      data={PAGE_DATA}
      heroMedia={<HeroScene name="prison" />}
      enterprise={ENTERPRISE_FEATURES}
      modules={MODULES_DATA}
      modulesTitle="Management Modules for Secure Communications"
      overviewLead="The Engine Behind"
      highlight={PAGE_DATA.title}
      featuresTitle={`Everything ${PAGE_DATA.title} gives you`}
      enterpriseTitle="Empowering managed communications with reliability and security."
      benefitsTitle="Why institutions choose it"
      ctaBody="Talk to our telephony experts and get a tailored demo for your facility within 24 hours."
    />
  );
}
