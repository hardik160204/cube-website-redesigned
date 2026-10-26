import React from "react";
import {
  MonitorPlay, Link2, CalendarClock, Gauge, Search, Lock, ShieldCheck, Plug, Headphones, BrainCircuit,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";

// =========================================================================
// SCREEN LOGGER SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Screen Logger",
  tagline: "Next-generation multi-PC screen recording over the network — see what your customers experienced.",
  heroVideo: "/screen-logger-bg.mp4", // <-- UPDATE THIS TO YOUR VIDEO FILE NAME
  overviewImage: "/screen-logger-overview.png", // <-- UPDATE THIS TO YOUR OVERVIEW IMAGE
  stats: [
    { value: "Multi-PC", label: "Network Recording" },
    { value: "Synced", label: "With Voice Logs" },
    { value: "Low", label: "Bandwidth Use" },
  ],
  overview: [
    "Cube Screen Logger is the industry's next-generation software solution for recording multiple PC screens across a network. Paired with the Callisto Voice Logger, it replays exactly what an agent saw and did while a call was in progress — the complete interaction, not just the audio.",
    "Quality teams use it to audit process compliance, trainers use it to build real-world coaching material, and security teams use it to investigate incidents. Recording is triggered automatically by call events or schedules, and consumes minimal bandwidth and storage.",
  ],
  features: [
    { icon: MonitorPlay, title: "Multi-Screen Capture", description: "Record dozens of workstations simultaneously over LAN/WAN." },
    { icon: Link2, title: "Voice-Screen Sync", description: "Replay screen video perfectly aligned with call audio." },
    { icon: CalendarClock, title: "Event & Schedule Triggers", description: "Start recording on call connect, app launch or timetable." },
    { icon: Gauge, title: "Efficient Codec", description: "Smart compression keeps bandwidth and disk usage tiny." },
    { icon: Search, title: "Indexed Playback", description: "Find sessions by agent, time, call ID or campaign." },
    { icon: Lock, title: "Access Controls", description: "Role-based playback rights with complete audit logging." },
  ],
  benefits: [
    "Audit the full interaction — voice plus screen",
    "Build powerful, real-example training libraries",
    "Prove process compliance to auditors and clients",
    "Deter data leakage on sensitive floors",
    "Minimal footprint on agent PCs",
    "Central web console for QA teams",
  ],
  useCases: ["Contact center QA", "Banking process audits", "BPO client compliance", "Training & onboarding"],
  faqs: [
    { q: "What is Cube Screen Logger?", a: "Cube Screen Logger is a network-based software solution that captures the desktop activity of agents simultaneously, providing a visual record of their interactions." },
    { q: "Does it sync with call audio?", a: "Yes, when paired with the Callisto Voice Logger, the screen recordings perfectly synchronize with the call audio, allowing you to see exactly what the agent was doing during the conversation." },
    { q: "Will recording screens slow down our network or agent PCs?", a: "No, the software uses a highly efficient, smart compression codec that minimizes both bandwidth usage and local CPU footprint." },
    { q: "How is the screen recording triggered?", a: "Recordings can be triggered automatically by specific call events (like call connect), application launches, or based on predefined schedules." },
    { q: "Can we restrict who has access to view these recordings?", a: "Absolutely. The platform includes strict, role-based access controls and comprehensive audit logging to ensure only authorized personnel can replay sensitive screen captures." },
    { q: "How do we search for a specific recording?", a: "Sessions are fully indexed. You can easily search for specific interactions using parameters like agent name, date, time, call ID, or campaign." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Enterprise Security", description: "Encrypted protocols, fraud monitoring and hardened infrastructure that protect every interaction." },
  { icon: Plug, title: "API Integration", description: "Plug into your own applications through clean, well-documented APIs to trigger recordings." },
  { icon: Headphones, title: "24/7 Support", description: "Never skip a beat. Secure 24/7 dedicated support for your critical compliance infrastructure." },
  { icon: BrainCircuit, title: "Smart Compression", description: "Elevate your storage efficiency with intelligent codecs that maintain clarity without bloating disks." },
];

export default function ScreenLogger() {
  return <ProductPage data={PAGE_DATA} enterprise={ENTERPRISE_FEATURES} highlight="Screen Recording" overviewImage="/products/screen-logger.jpg" />;
}
