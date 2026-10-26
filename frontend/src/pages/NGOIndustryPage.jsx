import React from "react";
import { Globe, Heart, Megaphone, PhoneCall, Smartphone, Users } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    label: "NGOs & Non-Profits",
    title: <>{"Drive Awareness & "}<Hi>Fundraising</Hi></>,
    body: [
      "Amplify your social impact. Connect with donors, run nationwide awareness campaigns, and manage crisis helplines with cost-effective cloud telephony.",
    ],
    image: "/ngo-industry.svg", imageAlt: "NGO Cloud Telephony",
    button: "Book a Demo",
  },
  {
    label: "Why Non-Profits Choose Us",
    title: "Technology that scales your social impact",
    cards: [
      { icon: Megaphone, title: "Mass Awareness Campaigns", desc: "Broadcast pre-recorded voice messages to rural and urban demographics instantly to spread social awareness." },
      { icon: Smartphone, title: "Missed Call Pledges", desc: "Allow supporters to register for a cause, sign a petition, or show support simply by giving a free missed call." },
      { icon: PhoneCall, title: "Toll-Free Helplines", desc: "Set up 24/7 toll-free numbers for crisis helplines, ensuring anyone can reach out for help without phone charges." },
      { icon: Users, title: "Volunteer Coordination", desc: "Use automated dialers and SMS to organize volunteers, coordinate relief efforts, and manage fundraising drives." },
    ],
  },
  {
    title: "Connect with every community, everywhere.",
    list: [
      "Multi-Lingual IVR for Regional Outreach",
      "Automated Donation Reminders via SMS",
      "High-Volume Disaster Relief Broadcasting",
      "CRM Integration for Donor Management",
    ],
    cards: [
      { icon: Heart, title: "Donor Outreach", desc: "Use intelligent dialers to connect your fundraising team with potential donors efficiently." },
      { icon: Globe, title: "National Helplines", desc: "Route nationwide toll-free calls to specific regional centers based on the caller's location." },
    ],
  },
];

export default function NGOIndustryPage() {
  return <FlexPage sections={SECTIONS} related />;
}
