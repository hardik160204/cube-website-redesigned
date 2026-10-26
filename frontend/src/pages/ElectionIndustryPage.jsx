import React from "react";
import { BarChart3, Megaphone, Mic, PhoneForwarded, Users } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    label: "Election Campaigns",
    title: <>{"Mobilize Your "}<Hi>Voter Base</Hi></>,
    body: [
      "Reach millions instantly. Run targeted voice broadcasts, conduct automated polling, and coordinate massive phone-banking efforts for your political campaigns.",
    ],
    image: "/voter-outreach-hero.svg", imageAlt: "Election Campaign Telephony",
    button: "Book a Demo",
  },
  {
    label: "Why Political Strategists Use Cube",
    title: "Scale your political outreach effortlessly",
    cards: [
      { icon: Megaphone, title: "Voter Voice Broadcasting", desc: "Send personalized, pre-recorded messages from the candidate directly to millions of voters in their local language." },
      { icon: BarChart3, title: "Automated Polling & Surveys", desc: "Conduct large-scale automated IVR surveys to gauge voter sentiment, collect feedback, and track campaign performance." },
      { icon: Users, title: "Volunteer Coordination", desc: "Use cloud contact centers to manage thousands of campaign volunteers for remote phone-banking and voter outreach." },
      { icon: PhoneForwarded, title: "Supporter Registration", desc: "Deploy missed call numbers on campaign banners so voters can easily pledge support and subscribe to updates." },
    ],
  },
  {
    title: "Connect directly with the electorate.",
    list: [
      "High-Speed Predictive Dialers for Phone Banking",
      "Regional Language IVR Menus",
      "Rally Invitation & Reminder Broadcasts",
      "Real-Time Campaign Analytics Dashboard",
    ],
    cards: [
      { icon: Mic, title: "Personalized Messaging", desc: "Deliver high-quality recorded messages from the candidate to specific voter demographics." },
      { icon: BarChart3, title: "Survey Analytics", desc: "Instantly gather and analyze keypad inputs from voters to adjust your campaign strategy." },
    ],
  },
];

export default function ElectionIndustryPage() {
  return <FlexPage sections={SECTIONS} related />;
}
