import React from "react";
import { BarChart, CheckCircle2, Clock, Database, Filter, GitMerge, Globe, Headset, MapPin, Network, RefreshCw, ShieldCheck, Star, Users, Zap } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "smart-call-routing",
    title: <>{"Intelligent "}<Hi>Call Routing</Hi></>,
    body: [
      "Connect every caller to the right agent, at the right time, every single time. Reduce hold times, boost first-call resolution, and deliver a seamless customer experience.",
    ],
    button: "Optimize Your Routing",
  },
  {
    title: <>{"End the Frustration of "}<Hi>Call Transfers</Hi></>,
    body: [
      "Smart Call Routing (Automatic Call Distribution) is an advanced cloud telephony engine that analyzes incoming calls and instantly routes them to the most appropriate agent or department based on predefined business rules.",
      "Instead of placing callers in endless generic queues or bouncing them between departments, the system uses data like caller ID, time of day, IVR input, and agent skill levels to ensure a perfect match on the very first try.",
    ],
    tiles: [{ icon: Filter, label: "Filter" }, { icon: GitMerge, label: "Distribute" }, { icon: Star, label: "Prioritize" }, { icon: Headset, label: "Connect" }],
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use Smart Routing?"}</>,
    cards: [
      { icon: Star, title: "VIP Caller Prioritization", desc: "Instantly recognize high-value clients via caller ID and jump them to the front of the queue, connecting them to premium account managers." },
      { icon: MapPin, title: "Regional Support", desc: "Automatically detect the caller's area code and route them to an agent in their specific region or an agent who speaks their local language." },
      { icon: Clock, title: "After-Hours Management", desc: "When your primary office closes, seamlessly route calls to a secondary global office, an outsourced call center, or a voicemail system." },
      { icon: Users, title: "Equitable Load Balancing", desc: "Distribute incoming calls evenly among your sales team (Round Robin) to ensure fair lead distribution and prevent agent burnout." },
      { icon: CheckCircle2, title: "Sticky Routing", desc: "If a customer drops a call and dials back, route them directly to the exact same agent they were just speaking with to maintain continuity." },
      { icon: ShieldCheck, title: "Disaster Recovery", desc: "If a localized outage hits a specific branch, instantly reroute all traffic to a backup facility without the customer ever noticing a delay." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Call Analysis", desc: "When a call arrives, the system instantly analyzes the caller ID, time of day, geographic location, and any inputs provided via the IVR." },
      { title: "Rule Evaluation", desc: "The engine cross-references this data with your customized business logic (e.g., 'If caller is from NY and it is 2 PM, look for English Tech Support')." },
      { title: "Agent Bridging", desc: "The call is seamlessly bridged to the most qualified available agent. If no one is available, fallback rules (like voicemail) are triggered." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>Routing Engine?</Hi></>,
    cards: [
      { icon: Network, title: "Multi-Level Logic", desc: "Build deeply nested routing trees. Combine time-based routing with skill-based routing to create highly granular call distribution paths." },
      { icon: RefreshCw, title: "Fallback Protocols", desc: "Never lose a caller. If a primary agent group is busy, automatically cascade the call to a secondary group, an external number, or a smart voicemail box." },
      { icon: Database, title: "CRM Data Lookups", desc: "Our engine integrates with Salesforce and Zoho to query database fields in real-time. Route calls based on lead status, account owner, or ticket severity." },
      { icon: Zap, title: "Instant Scalability", desc: "Add or remove routing nodes, update agent skills, and change business hours on the fly via the dashboard without any downtime or technical support." },
      { icon: Globe, title: "Device Agnostic", desc: "Route calls to softphones, landlines, IP phones, or agent mobile devices globally. Agents can log in from anywhere and receive routed calls." },
      { icon: BarChart, title: "Queue Analytics", desc: "Monitor hold times, abandonment rates, and queue lengths in real-time. Make data-driven decisions to adjust staffing and routing rules on the fly." },
    ],
  },
  {
    title: <>{"Advanced "}<Hi>Routing Modes</Hi></>,
    cards: [
      { icon: Star, title: "Skill-Based Routing", desc: "Assign proficiency tags to your agents (e.g., Spanish Speaker, Tech Support Tier 2). The system matches the caller's need to the agent with the highest relevant skill score." },
      { icon: Clock, title: "Time & Day Routing", desc: "Create specific logic based on your operational hours. Route calls to the main office from 9-5, shift to a remote team in the evening, and direct to voicemail on weekends." },
      { icon: Users, title: "Round Robin Routing", desc: "Perfect for sales teams. The system distributes incoming leads evenly in a cycle (Agent A, then B, then C), ensuring everyone gets a fair share of opportunities." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to end call transfers forever?",
    body: [
      "Design intelligent call flows in minutes. Increase first-call resolution and empower your agents with our smart routing engine.",
    ],
    button: "Optimize Your Workflow",
  },
];

export default function CloudSmartCallRoutingPage() {
  return <FlexPage sections={SECTIONS} />;
}
