import React from "react";
import {
  Cloud, GitBranch, BarChart3, ShieldCheck, Globe, Plug, PhoneOutgoing, PhoneIncoming, ListChecks, LayoutDashboard, Database, Mic, FileAudio, Users, Workflow, Megaphone, MessageSquare, Radio, Phone, Headphones, BrainCircuit, Headset, Bot, MousePointerClick, History, LineChart, UserCheck, PhoneOff, Inbox,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";
import { ContactCenterLive } from "../components/page/HeroScenes";

// =========================================================================
// CLOUD CONTACT CENTER SPECIFIC DATA
// =========================================================================
export const PAGE_DATA = {
  title: "Contact Center Solution",
  tagline: "Get results with a powerful inbound, outbound and blended cloud contact center solution with full call disposition.",
  heroVideo: "/contact-center-image.png",
  stats: [
    { value: "3x", label: "Agent Productivity" },
    { value: "ACD/IVR/PD", label: "Complete Suite" },
    { value: "Hosted", label: "or On-Premise" },
  ],
  overview: [
    "Cloud Contact Center Solution is Cube Software's flagship contact-center engine — a complete suite covering inbound ACD, outbound predictive/progressive/preview dialing and blended operations. Agents see customer context before they speak; supervisors see everything in real time.",
    "Available for both international and domestic operations, on-premise or fully hosted, the platform ships with comprehensive modules including ACD, IVR, predictive dialing, call disposition, campaign management and quality monitoring — everything a modern contact center floor needs.",
  ],
  features: [
    { icon: PhoneOutgoing, title: "Predictive Dialing", description: "AI-paced dialing keeps agents talking, not waiting — with answering-machine detection." },
    { icon: PhoneIncoming, title: "Intelligent ACD", description: "Skill-based, priority and least-idle routing for inbound queues." },
    { icon: ListChecks, title: "Call Disposition", description: "Custom disposition trees, callbacks and lead recycling per campaign." },
    { icon: LayoutDashboard, title: "Supervisor Wallboards", description: "Live monitoring, whisper, barge-in and force-logout controls." },
    { icon: Database, title: "Campaign & Lead Manager", description: "Upload, filter, dedupe and pace lead lists with DNC scrubbing." },
    { icon: Plug, title: "CRM Screen-Pop", description: "Native connectors for Salesforce and custom CRMs." },
  ],
  benefits: [
    "Triple outbound connect rates with predictive pacing",
    "Blend inbound and outbound on the same agent pool",
    "Comprehensive suite — ACD, IVR, PD in one licence",
    "Deploy on-premise or hosted, domestic or international",
    "Full recording and disposition audit trail",
    "Scales from 5-seat teams to 1,000-seat BPO floors",
  ],
  useCases: ["BPO & KPO floors", "Telesales and collections", "Customer support desks", "Political & survey campaigns"],
  faqs: [
    { q: "What is a Cloud Contact Center Solution?", a: "It is a comprehensive, network-based platform that handles inbound and outbound customer communications across multiple channels without the need for extensive on-premise hardware infrastructure." },
    { q: "Does this solution support remote or work-from-home agents?", a: "Yes, our Cloud Contact Center is fully web-based. Agents can securely log in from anywhere using a standard internet browser and a headset, making it perfect for distributed or remote teams." },
    { q: "What kind of dialers are included?", a: "The suite includes a powerful auto dialer engine equipped with Predictive, Progressive, and Preview pacing modes, ensuring maximum agent talk time and flexible campaign execution." },
    { q: "Can it integrate with our existing CRM software?", a: "Absolutely. We offer seamless API and native integrations with popular CRMs like Salesforce, Zoho, Freshdesk, and customized enterprise platforms for instant screen-pops and automated data syncing." },
    { q: "How does the Intelligent ACD route calls?", a: "Our Automatic Call Distributor (ACD) uses advanced skill-based, priority, and least-idle routing algorithms to connect customers to the most qualified available agent instantly." },
    { q: "Is call recording included in the platform?", a: "Yes, 100% of interactions are recorded and logged. Supervisors can monitor live calls, utilize whisper/barge-in features, and review historical recordings for QA, training, and compliance." },
  ],
};

export const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Enterprise Security", description: "Encrypted protocols, fraud monitoring and hardened infrastructure that protect every conversation your teams have." },
  { icon: Plug, title: "CRM & API Integration", description: "Plug into Salesforce, Freshdesk and your own apps through clean, well-documented APIs." },
  { icon: Headphones, title: "24/7 Support", description: "Never skip a beat. Secure 24/7 dedicated support for your critical business communications." },
  { icon: BrainCircuit, title: "AI Call Management", description: "AI that listens, routes, and scores. Elevate your team with smart routing, sentiment analysis, and automated QA." },
];

// --- FIX: MOVED THESE ABOVE THE MODULES_DATA ARRAY ---
// Fallback dummy icons to prevent breaking if Lucide lacks exact names
const FileText = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;

const Settings = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;

export const MODULES_DATA = [
  {
    id: "inbound",
    iconColor: "text-orange-500",
    icon: Headset,
    title: "Inbound Communication",
    items: [
      { text: "Multi-level IVR for structured call handling", icon: GitBranch },
      { text: "Toll-free numbers and virtual numbers for customer access", icon: Phone },
      { text: "Missed call services with automated response workflows", icon: PhoneOff },
      { text: "Skill-based routing, queue management, and call recordings", icon: LineChart },
      { text: "Sticky agent routing for repeat callers", icon: UserCheck },
      { text: "Softphone for browser-based call handling", icon: Mic }
    ]
  },
  {
    id: "outbound",
    iconColor: "text-blue-600",
    icon: Megaphone,
    title: "Outbound Communication & Campaigns",
    items: [
      { text: "Auto dialer with predictive, progressive, and preview dialing", icon: PhoneOutgoing },
      { text: "Click-to-call from CRM and business applications", icon: MousePointerClick },
      { text: "Voice broadcast for bulk outbound communication", icon: Radio },
      { text: "Campaign management with retry and follow-up logic", icon: BarChart3 },
      { text: "Lead distribution and outbound workflow control", icon: Users },
      { text: "True caller integration for verified outbound identity", icon: ShieldCheck }
    ]
  },
  {
    id: "messaging",
    iconColor: "text-emerald-500",
    icon: MessageSquare,
    title: "Messaging & Omnichannel Interaction Handling",
    items: [
      { text: "SMS and RCS-based customer communication", icon: MessageSquare },
      { text: "WhatsApp Business API for conversational messaging", icon: MessageSquare },
      { text: "Unified inbox for managing chat and messaging channels", icon: Inbox },
      { text: "Conversation history and context tracking across channels", icon: History },
      { text: "Template-based messaging and quick replies", icon: FileText },
      { text: "Cross-channel interaction visibility for agents", icon: Globe }
    ]
  },
  {
    id: "ai",
    iconColor: "text-amber-500",
    icon: Bot,
    title: "Artificial Intelligence & Automation",
    items: [
      { text: "AI voice bot for automated inbound interactions", icon: Mic },
      { text: "AI-powered call transcription and summarization", icon: FileAudio },
      { text: "Post-call analysis with conversation insights and trends", icon: LineChart },
      { text: "Workflow automation for routing, follow-ups, and task triggers", icon: Settings },
      { text: "Rule-based interaction handling and escalation logic", icon: GitBranch },
      { text: "Performance insights for agents and contact center operations", icon: BarChart3 }
    ]
  }
];

export default function CloudContactCenter() {
  return (
    <ProductPage
      data={PAGE_DATA}
      enterprise={ENTERPRISE_FEATURES}
      modules={MODULES_DATA}
      modulesTitle="Contact Center Modules for End-to-End Business Communication"
      highlight={PAGE_DATA.title}
      heroMedia={<ContactCenterLive stats={PAGE_DATA.stats} />}
      showStats={false}
      overviewImage="/products/contact-center.jpg"
    />
  );
}
