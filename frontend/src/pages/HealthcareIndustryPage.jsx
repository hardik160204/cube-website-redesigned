import React from "react";
import { CalendarClock, Clock, PhoneCall, ShieldCheck, Stethoscope } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    label: "Healthcare Solutions",
    title: <>{"Patient-First "}<Hi>Communication</Hi></>,
    body: [
      "Automate patient reminders, handle emergency routing, and manage hospital helpdesks seamlessly 24/7 with our reliable cloud telephony suite.",
    ],
    image: "/healthcare-nurse-hero.svg", imageAlt: "Healthcare Cloud Telephony",
    button: "Book a Demo",
  },
  {
    label: "Why Hospitals Choose Us",
    title: "Always on when lives depend on it",
    cards: [
      { icon: CalendarClock, title: "Automated Reminders", desc: "Send automated voice broadcasts and SMS to patients for upcoming appointments, reducing no-shows." },
      { icon: PhoneCall, title: "Emergency Routing", desc: "Prioritize critical calls with smart IVR menus that immediately route emergencies to on-call doctors." },
      { icon: ShieldCheck, title: "Patient Data Security", desc: "Ensure patient confidentiality with secure, encrypted call recording that meets healthcare compliance standards." },
      { icon: Stethoscope, title: "Tele-consultation", desc: "Enable doctors to securely connect with patients remotely using our integrated conference bridges." },
    ],
  },
  {
    title: "Connect patients to care faster.",
    list: [
      "Centralized Helpdesk for Multiple Clinics",
      "Automated Lab Result Notifications",
      "Toll-Free Numbers for Emergency Lines",
      "Integration with Hospital Management Systems (HMS)",
    ],
    cards: [
      { icon: Clock, title: "24/7 Availability", desc: "Smart IVRs ensure patients can get information or route to on-call staff after hours." },
      { icon: PhoneCall, title: "Rapid Response", desc: "Dedicated priority queues for urgent medical inquiries and ambulance coordination." },
    ],
  },
];

export default function HealthcareIndustryPage() {
  return <FlexPage sections={SECTIONS} related />;
}
