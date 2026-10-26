import React from "react";
import { Bell, Database, GraduationCap, Headphones, PhoneCall } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    label: "Education & EdTech",
    title: <>{"Streamline Campus "}<Hi>Communication</Hi></>,
    body: [
      "Connect students, parents, and faculty effortlessly. Automate critical updates, scale your admissions helpdesk, and improve enrollment rates.",
    ],
    image: "/education-industry.svg", imageAlt: "Education Cloud Telephony",
    button: "Book a Demo",
  },
  {
    label: "Why Institutions Choose Us",
    title: "Enhance student engagement and support",
    cards: [
      { icon: Bell, title: "Automated Notifications", desc: "Send instant voice and SMS alerts to parents regarding fee deadlines, attendance, exams, and emergency closures." },
      { icon: Headphones, title: "Admissions Helpdesk", desc: "Equip your counselors with a cloud contact center to efficiently handle high volumes of admission inquiries." },
      { icon: PhoneCall, title: "Self-Service IVR", desc: "Allow students to check exam dates, download forms, or route to specific departments without human intervention." },
      { icon: Database, title: "EdTech CRM Integration", desc: "Sync calls directly with your student database so counselors have complete academic history during calls." },
    ],
  },
  {
    title: "Boost your enrollment conversions.",
    list: [
      "Predictive Dialers for Course Promotions",
      "Toll-Free Numbers for Prospective Students",
      "Call Recording for Quality Assurance",
      "Seamless Integration with Campus ERPs",
    ],
    cards: [
      { icon: GraduationCap, title: "Admissions Campaigns", desc: "Use auto-dialers to follow up on website leads and increase your total student intake." },
      { icon: Bell, title: "Parent Updates", desc: "Automatically push attendance alerts and fee reminders directly to parents' phones." },
    ],
  },
];

export default function EducationIndustryPage() {
  return <FlexPage sections={SECTIONS} related />;
}
