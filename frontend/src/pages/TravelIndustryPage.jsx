import React from "react";
import { CalendarClock, Globe, Headphones, Map, MessageSquare, PhoneCall } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    label: "Travel & Tourism",
    title: <>{"Elevate the "}<Hi>Traveler Experience</Hi></>,
    body: [
      "Seamless communication for travel agencies, tour operators, and transport networks. Handle high booking volumes and deliver instant travel updates.",
    ],
    image: "/travel-industry-hero.svg", imageAlt: "Travel Cloud Telephony",
    button: "Book a Demo",
  },
  {
    label: "Why Travel Brands Choose Us",
    title: "Keep your travelers connected globally",
    cards: [
      { icon: Headphones, title: "24/7 Booking Support", desc: "Ensure travelers can reach your support desks anytime, from anywhere, with reliable cloud contact centers." },
      { icon: CalendarClock, title: "Automated Itinerary Updates", desc: "Send automated voice broadcasts or SMS alerts for flight delays, booking confirmations, and schedule changes." },
      { icon: Globe, title: "International Toll-Free", desc: "Provide global customers with free-to-call numbers, routing international queries directly to your local agents." },
      { icon: PhoneCall, title: "Smart IVR Menus", desc: "Route callers efficiently based on their needs—press 1 for new bookings, 2 for cancellations, 3 for support." },
    ],
  },
  {
    title: "Manage peak holiday seasons with ease.",
    list: [
      "CRM Integration for Personalized Support",
      "High-Volume Outbound Promotional Campaigns",
      "Remote Agent Setup for Distributed Teams",
      "Multi-lingual IVR for Diverse Tourists",
    ],
    cards: [
      { icon: Map, title: "Package Promotions", desc: "Use predictive dialers to rapidly pitch new holiday packages to your lead database." },
      { icon: MessageSquare, title: "Instant Dispute Resolution", desc: "Retrieve crystal-clear voice logs to quickly resolve booking or payment disputes." },
    ],
  },
];

export default function TravelIndustryPage() {
  return <FlexPage sections={SECTIONS} related />;
}
