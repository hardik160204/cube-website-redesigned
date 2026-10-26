import React from "react";
import { Database, GitMerge, Globe, Headset, LifeBuoy, LineChart, MapPin, MessageSquare, Mic, Network, ShieldCheck, ShoppingCart, Star, Users } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "toll-free",
    title: <><Hi>Toll Free Numbers</Hi></>,
    body: [
      "Build a premium brand image and enhance customer satisfaction. Provide your callers with a free, memorable 1800 number integrated directly with our cloud telephony suite.",
    ],
    button: "Get Your 1800 Number",
  },
  {
    title: <>{"Empower Callers with "}<Hi>Free Connectivity</Hi></>,
    body: [
      "A Toll-Free Number (typically starting with 1800) allows your customers to call your business without being charged for the call. The cost of the connection is borne entirely by your business.",
      "Offering a toll-free number removes the friction of call charges, significantly increasing incoming queries. It portrays your company as an established, customer-centric enterprise with a reliable national presence.",
    ],
    image: "/toll-free-illustration.svg", imageAlt: "Toll-Free Number Connectivity",
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use Toll Free Numbers?"}</>,
    cards: [
      { icon: Headset, title: "24/7 Customer Support", desc: "Provide a unified national helpline for technical support, grievances, and queries. Route calls to different branches based on time and location." },
      { icon: LineChart, title: "Marketing Campaigns", desc: "Publish different toll-free numbers on billboards, print ads, and TV to accurately track the ROI and lead volume of each specific campaign." },
      { icon: ShoppingCart, title: "Order Booking Lines", desc: "Make it effortless for customers to place orders over the phone. Free calling encourages impulsive inquiries and boosts telesales." },
      { icon: LifeBuoy, title: "Centralized Helpdesks", desc: "Consolidate multiple regional phone numbers into one memorable 1800 number, drastically simplifying how clients reach your organization." },
      { icon: MessageSquare, title: "Feedback Collection", desc: "Encourage customers to leave feedback or participate in automated IVR surveys by ensuring the call costs them absolutely nothing." },
      { icon: Users, title: "Remote Work Enablement", desc: "A single toll-free number can mask the personal mobile numbers of your remote agents, projecting a cohesive corporate identity." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Customer Dials 1800-XXX", desc: "The customer dials your memorable toll-free number from any mobile or landline network nationwide at absolutely zero cost." },
      { title: "Cloud IVR Greets Caller", desc: "The call hits our secure cloud telephony servers where a custom, professional IVR greeting welcomes the caller immediately." },
      { title: "Smart Routing Connects", desc: "Based on the caller's input (Press 1 for Sales, 2 for Support), the system routes the call to the mobile or desktop of the right agent." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>Toll Free Solution?</Hi></>,
    cards: [
      { icon: Star, title: "Vanity Numbers", desc: "Choose a number that spells your brand name (e.g., 1800-XXX-PIZZA), making it exponentially easier for customers to memorize." },
      { icon: GitMerge, title: "Advanced Call Routing", desc: "Route calls sequentially, simultaneously, or based on geography and time zones to ensure no incoming query goes unanswered." },
      { icon: Mic, title: "Built-in IVR System", desc: "Every toll-free number comes with a multi-level Interactive Voice Response system to greet customers and qualify leads automatically." },
      { icon: LineChart, title: "Real-Time Analytics", desc: "Access a live dashboard detailing call volumes, missed calls, average hold times, and agent performance metrics." },
      { icon: Database, title: "CRM Integration", desc: "Sync your toll-free traffic directly into Salesforce, Zoho, or HubSpot. Auto-generate tickets and log call recordings natively." },
      { icon: ShieldCheck, title: "High Availability", desc: "Hosted on enterprise-grade cloud architecture guaranteeing 99.9% uptime. Handle thousands of concurrent callers without infrastructure limits." },
    ],
  },
  {
    title: <>{"Types of "}<Hi>Toll Free Numbers</Hi></>,
    cards: [
      { icon: MapPin, title: "Domestic Toll Free", desc: "The standard 1800 number applicable within your native country. Perfect for nationwide brands looking to consolidate local offices into one helpline." },
      { icon: Globe, title: "International Toll Free (ITFS)", desc: "Provide a toll-free number specific to another country. A customer in the US can call an ITFS number for free, and it seamlessly routes to your call center in India." },
      { icon: Network, title: "Universal Freephone (UIFN)", desc: "A single, unified 800 number that works across multiple countries globally. Ideal for large multinational corporations offering consistent global support." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to build a premium brand image?",
    body: [
      "Remove call charges for your customers and watch your inbound inquiries multiply. Get your custom 1800 number live today.",
    ],
    button: "Search Available Numbers",
  },
];

export default function CloudTollFreeNumberPage() {
  return <FlexPage sections={SECTIONS} />;
}
