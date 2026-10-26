import React from "react";
import { AlertCircle, CheckCircle2, Cloud, Database, Download, FileAudio, Filter, Lock, Mic, PlayCircle, Search, Server, ShieldCheck, TrendingUp, Users } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "call-recording",
    title: <><Hi>Call Recording</Hi></>,
    body: [
      "Securely capture, store, and analyze 100% of your business conversations. Ensure compliance, resolve disputes instantly, and train your agents with crystal-clear audio logs.",
    ],
    button: "Start Recording Free",
  },
  {
    title: <>{"Never Miss a "}<Hi>Single Detail</Hi></>,
    body: [
      "Cloud Call Recording is an automated solution that seamlessly captures both sides of a telephone conversation. The audio is instantly compressed, encrypted, and saved to a secure cloud server the moment a call ends.",
      "Whether you are monitoring inbound support calls for quality assurance, or logging outbound sales calls for legal compliance, having an irrefutable audio log protects your business and empowers your management team.",
    ],
    tiles: [{ icon: Mic, label: "Capture" }, { icon: Cloud, label: "Store" }, { icon: PlayCircle, label: "Playback" }, { icon: Lock, label: "Encrypt" }],
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use Call Recording?"}</>,
    cards: [
      { icon: ShieldCheck, title: "Legal & Compliance", desc: "Sectors like finance and healthcare use recordings to prove compliance with regulations (like HIPAA or PCI) and maintain undeniable legal records." },
      { icon: AlertCircle, title: "Dispute Resolution", desc: "Instantly resolve 'he-said-she-said' conflicts. Pull up the exact audio file to verify what was promised to a customer or agreed upon by a vendor." },
      { icon: Users, title: "Agent Training", desc: "Use actual recordings of your best salespeople closing deals, or agents handling angry customers, to train new hires with real-world examples." },
      { icon: CheckCircle2, title: "Quality Assurance", desc: "Managers can periodically review recorded calls to ensure agents are following scripts, maintaining a polite tone, and representing the brand correctly." },
      { icon: TrendingUp, title: "Sales Strategy", desc: "Analyze recorded calls to identify customer pain points, frequently asked questions, and objections to refine your marketing and sales pitches." },
      { icon: FileAudio, title: "Verbal Contracts", desc: "Capture verbal authorizations for upgrades, payments, or contract renewals over the phone, storing them securely as legally binding proof." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Call is Initiated", desc: "An inbound or outbound call connects through our cloud servers. A mandatory compliance beep or message can be played if required." },
      { title: "Real-Time Capture", desc: "Our infrastructure captures high-definition audio of both the agent and the customer without any lag or hardware on your end." },
      { title: "Instant Cloud Storage", desc: "The moment the call ends, the audio is encrypted, compressed, and attached to the call log in your dashboard or CRM." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>Recording Solution?</Hi></>,
    cards: [
      { icon: Server, title: "Unlimited Cloud Storage", desc: "Never run out of hard drive space again. We offer vast, scalable cloud storage solutions to keep your records safe for years." },
      { icon: Lock, title: "Bank-Grade Encryption", desc: "Protect sensitive customer data. All audio files are secured with AES-256 encryption at rest and in transit." },
      { icon: Search, title: "Advanced Search", desc: "Instantly locate specific recordings by filtering through date, time, agent name, caller ID, or call duration parameters." },
      { icon: Filter, title: "Selective Recording", desc: "Record 100% of calls, or apply filters to only record specific departments, specific agents, or random sampling for QA." },
      { icon: Download, title: "Export & Download", desc: "Download individual MP3/WAV files for evidence, or bulk export thousands of recordings directly to your local servers via API." },
      { icon: Database, title: "CRM Synchronization", desc: "Automatically attach the playable audio file link directly inside the customer's timeline in Salesforce, Zoho, or HubSpot." },
    ],
  },
  {
    title: <>{"Flexible "}<Hi>Recording Modes</Hi></>,
    cards: [
      { icon: Database, title: "100% Blanket Recording", desc: "Every single inbound and outbound call is automatically recorded and archived. Perfect for strict regulatory environments like banking and insurance." },
      { icon: CheckCircle2, title: "On-Demand Recording", desc: "Give agents control. They can press a specific key during a live conversation to start or stop recording, ideal for capturing verbal contracts while excluding small talk." },
      { icon: Lock, title: "PCI Pause & Resume", desc: "When a customer reads out sensitive credit card data over the phone, the agent can temporarily mute the recording to ensure complete PCI compliance." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to secure your business conversations?",
    body: [
      "Protect your company from liability, improve agent quality, and never lose track of what was said on a call.",
    ],
    button: "Start Recording Today",
  },
];

export default function CloudCallRecordingPage() {
  return <FlexPage sections={SECTIONS} />;
}
