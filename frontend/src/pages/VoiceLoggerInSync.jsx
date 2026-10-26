import React from "react";
import {
  DatabaseZap, Search, Gauge, ShieldCheck, Layers, BarChart3, Plug, Headphones, BrainCircuit,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";

// =========================================================================
// VOICE LOGGER INSYNC SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Voice Logger InSync",
  tagline: "Centralise critical recording data from every location into one synchronised archive.",
  heroVideo: "/voice-logger-insync-bg.mp4", // <-- UPDATE THIS TO YOUR VIDEO FILE NAME
  overviewImage: "/voice-logger-insync-overview.png", // <-- UPDATE THIS TO YOUR OVERVIEW IMAGE
  stats: [
    { value: "Multi-Site", label: "Consolidation" },
    { value: "Auto", label: "Sync Engine" },
    { value: "1 View", label: "Central Search" },
  ],
  overview: [
    "Cube application products such as Voice Logger, Voice Mail, Fax Server and Call Accounting generate and store large volumes of critical data. When large corporates run these products at multiple locations, that data lives in silos — until InSync.",
    "Voice Logger InSync automatically replicates recordings and metadata from every branch to a central repository, giving head-office compliance and QA teams a single searchable window across the whole enterprise, with bandwidth-friendly scheduled synchronisation.",
  ],
  features: [
    { icon: DatabaseZap, title: "Automated Replication", description: "Branch recordings sync to HQ on schedules you define." },
    { icon: Search, title: "Central Search", description: "One query across every location, extension and date range." },
    { icon: Gauge, title: "Bandwidth Throttling", description: "Off-peak sync windows protect branch connectivity." },
    { icon: ShieldCheck, title: "Integrity Verification", description: "Checksums guarantee nothing is lost or altered in transit." },
    { icon: Layers, title: "Multi-Product Support", description: "Syncs voice logs, voicemail, fax and accounting data." },
    { icon: BarChart3, title: "Enterprise Dashboards", description: "Consolidated compliance and usage reporting for HQ." },
  ],
  benefits: [
    "Single source of truth for all branch recordings",
    "Faster compliance responses — no branch phone calls",
    "Disaster-proof: central copy survives branch failures",
    "Efficient use of WAN links with scheduled sync",
    "Uniform retention policy across the enterprise",
    "Scales with unlimited branch nodes",
  ],
  useCases: ["Multi-branch banks", "Insurance networks", "Retail chain call desks", "Government departments"],
  faqs: [
    { q: "What is Voice Logger InSync?", a: "Voice Logger InSync is an automated data synchronization tool that replicates voice recordings, voicemail, and telecom data from multiple branch locations to a centralized headquarters repository." },
    { q: "How does it handle limited branch bandwidth?", a: "InSync features intelligent bandwidth throttling and scheduled sync windows, allowing you to replicate heavy audio files during off-peak hours without disrupting daytime branch connectivity." },
    { q: "Is the transferred data secure?", a: "Yes, all data transfers use encrypted protocols and include integrity verification via checksums, guaranteeing that no recordings are lost, corrupted, or altered in transit." },
    { q: "What types of data can it synchronize?", a: "InSync supports multi-product replication, including voice logs, voicemails, fax server documents, and call accounting data." },
    { q: "Can I search across all branches from one interface?", a: "Yes, once synchronized, HQ compliance and QA teams get a single, unified search window to query recordings across every location, extension, and date range." },
    { q: "What happens if a branch network goes down?", a: "Since InSync creates a centralized backup, your critical recordings survive local hardware or network failures, acting as a robust disaster recovery mechanism." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Enterprise Security", description: "Encrypted protocols, fraud monitoring and hardened infrastructure that protect every conversation your teams have." },
  { icon: Plug, title: "API Integration", description: "Plug into your own applications through clean, well-documented APIs to pull central data." },
  { icon: Headphones, title: "24/7 Support", description: "Never skip a beat. Secure 24/7 dedicated support for your critical business communications." },
  { icon: BrainCircuit, title: "Smart Syncing", description: "Elevate your infrastructure with intelligent delta-syncing, reducing overhead on active networks." },
];

export default function VoiceLoggerInSync() {
  return <ProductPage data={PAGE_DATA} enterprise={ENTERPRISE_FEATURES} highlight="Data Synchronization" heroImage="/products/voice-logger-insync.jpg" />;
}
