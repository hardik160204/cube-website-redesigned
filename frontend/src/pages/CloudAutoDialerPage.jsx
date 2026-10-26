import React from "react";
import { BarChart, CheckCircle2, Clock, Database, Globe, Maximize, Mic, Network, PhoneForwarded, Play, ShieldCheck, Users, Zap } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "auto-dialer",
    title: <>{"Smart Cloud "}<Hi>Auto Dialer</Hi></>,
    body: [
      "Automate outbound calls and maximize your agents' talk time. Eliminate manual dialing, detect voicemails, and boost your sales team's productivity.",
    ],
    image: "/auto-dialer-hero.png", imageAlt: "Auto Dialer Illustration",
    button: "Start Free Trial",
  },
  {
    title: <>{"Supercharge your "}<Hi>Outbound Campaigns</Hi></>,
    body: [
      "An auto dialer is an automated software system that dials phone numbers from a compiled list. Once the call is answered, the system either plays a recorded message or connects the call to a live agent.",
      "By filtering out busy signals, voicemails, and disconnected numbers, auto dialers ensure your agents spend their time doing what they do best: talking to real prospects.",
    ],
    image: "/outbound-campaign-illustration.svg", imageAlt: "Auto Dialer System",
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use Auto Dialers?"}</>,
    cards: [
      { icon: BarChart, title: "Boost Agent Productivity", desc: "Automate the dialing process to eliminate manual errors and keep your agents on the line with actual prospects instead of listening to dial tones." },
      { icon: Database, title: "Lead Management Sync", desc: "Instantly update customer profiles in your CRM based on call outcomes, ensuring your database remains accurate without manual entry." },
      { icon: Users, title: "Scalable Telemarketing", desc: "Easily scale your outbound campaigns up or down based on your business needs without investing in physical infrastructure." },
      { icon: Clock, title: "Time Zone Routing", desc: "Automatically schedule outbound calls based on the specific time zones of your prospects to remain compliant with calling regulations." },
      { icon: CheckCircle2, title: "Instant Callbacks", desc: "Configure immediate automated callbacks for abandoned calls or missed connections to ensure zero missed opportunities." },
      { icon: ShieldCheck, title: "Secure Calling", desc: "Protect your brand identity and customer privacy with secure, encrypted two-way call masking features during outbound campaigns." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Upload Contact Lists", desc: "Easily upload your target contact lists or sync them directly from your existing CRM database." },
      { title: "System Dials Automatically", desc: "The predictive algorithm dials numbers in the background, filtering out voicemails and busy signals." },
      { title: "Instant Agent Connection", desc: "The moment a live customer answers, the call is instantly routed to an available agent with the customer's data on screen." },
    ],
    steps: true,
  },
  {
    title: <>{"Why is an Auto Dialer essential "}<Hi>for your Business?</Hi></>,
    cards: [
      { icon: Network, title: "Smart call routing", desc: "Systems can be used to smartly route your calls in a time-based and team-based manner." },
      { icon: Mic, title: "Sound professional", desc: "Every customer gets a prime user experience with clear audio and zero connection delays." },
      { icon: PhoneForwarded, title: "Route calls with ease", desc: "Instantly connect connected calls to the most appropriate agent based on skill tracking." },
      { icon: Globe, title: "Support remote working", desc: "Work in any region without worry with our cloud-hosted dialing platform." },
      { icon: Maximize, title: "Scale with ease", desc: "Our platform comes with a choice of adding/removing agents at the click of a button. Scale your outbound volume without any worries!" },
      { icon: BarChart, title: "Reports and analytics", desc: "Real-time agent-wise reporting, call durations, and detailed outbound analytics." },
    ],
  },
  {
    title: <>{"Advanced "}<Hi>Dialing Modes</Hi></>,
    cards: [
      { icon: Zap, title: "Predictive Dialer", desc: "Uses intelligent algorithms to predict when an agent will be free, dialing multiple numbers simultaneously to ensure an agent is immediately connected to the next live caller." },
      { icon: Play, title: "Progressive Dialer", desc: "Dials one number per available agent. It only initiates a call when an agent is fully ready to take it, reducing abandoned calls to zero while maintaining a steady pace." },
      { icon: Database, title: "Preview Dialer", desc: "Displays customer CRM data on the screen before the call is placed. Agents can review the context and manually choose when to initiate the dial, perfect for high-value sales." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to multiply your agent's talk time?",
    body: [
      "Stop dialing manually. Let our smart algorithms connect your team directly to live answers and close more deals.",
    ],
    button: "Get a Free Demo Today",
  },
];

export default function CloudAutoDialerPage() {
  return <FlexPage sections={SECTIONS} />;
}
