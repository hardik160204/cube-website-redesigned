import React from "react";
import { Database, Home, Mic, PhoneForwarded, ShieldCheck, TrendingUp } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    label: "Real Estate",
    title: <>{"Accelerate Property "}<Hi>Sales</Hi></>,
    body: [
      "Empower your real estate brokers with smart dialers, CRM integrations, and campaign tracking to close deals faster and manage site visits effortlessly.",
    ],
    image: "/property-sales-hero.svg", imageAlt: "Real Estate Cloud Telephony and CRM Integration",
    button: "Book a Demo",
  },
  {
    label: "Why Top Developers Choose Us",
    title: "Turn inquiries into successful site visits",
    cards: [
      { icon: PhoneForwarded, title: "Predictive Lead Dialing", desc: "Connect your sales team to interested property buyers faster with automated outbound dialing campaigns." },
      { icon: Database, title: "Real Estate CRM Sync", desc: "Integrate directly with your property CRM to display buyer preferences and budget history on the agent's screen." },
      { icon: ShieldCheck, title: "Virtual Campaign Numbers", desc: "Assign unique virtual numbers to different property ads (billboards, digital) to accurately track marketing ROI." },
      { icon: Mic, title: "Dispute Resolution", desc: "Record 100% of calls to maintain a verifiable log of negotiations, offers, and client agreements." },
    ],
  },
  {
    title: "Manage multi-project campaigns easily.",
    list: [
      "Automated Follow-ups for Stale Leads",
      "Site Visit Scheduling & Reminders",
      "Project-Specific IVR Routing",
      "Multi-Branch Broker Coordination",
    ],
    cards: [
      { icon: TrendingUp, title: "Campaign Tracking", desc: "Track exactly which Facebook or Billboard ad generated the incoming call." },
      { icon: Home, title: "Site Visit Routing", desc: "Automatically connect buyers to the site manager nearest to the property location." },
    ],
  },
];

export default function RealEstateIndustryPage() {
  return <FlexPage sections={SECTIONS} related />;
}
