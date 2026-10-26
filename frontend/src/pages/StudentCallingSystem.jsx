import React from "react";
import {
  BarChart3, ShieldCheck, Globe, Landmark, PhoneIncoming, ListChecks, Database, Lock, Bell, Users, Receipt, Percent, Building, AlertTriangle, CalendarClock, Clock, Radio, Hourglass,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";
import { HeroScene } from "../components/page/HeroScenes";

// =========================================================================
// STUDENT CALLING SYSTEM SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Student & Hostel Calling System",
  tagline: "Managed campus communications with whitelisted directories, prepaid wallets, and automated schedule restrictions for educational institutions.",
  heroVideo: "/student-calling-image.png", 
  stats: [
    { value: "24/7", label: "Parent Access" },
    { value: "Prepaid", label: "Student Wallets" },
    { value: "Managed", label: "Time Schedules" },
  ],
  overview: [
    "Our Student Calling System provides boarding schools, university hostels, and educational campuses with a secure, managed infrastructure for student communications. It ensures students stay connected with their families while adhering to campus discipline.",
    "Administrators can easily enforce study-hour lockouts, restrict outgoing calls to parent-approved numbers, and allow families to seamlessly top up prepaid student calling accounts."
  ],
  features: [
    { icon: ListChecks, title: "Parent-Approved Directories", description: "Students can only dial whitelisted numbers approved by parents or guardians." },
    { icon: Clock, title: "Study-Hour Lockouts", description: "Automatically disable calling during classes, study hours, or late at night." },
    { icon: Landmark, title: "Prepaid Wallets", description: "Parents can easily recharge their child's calling account via a secure web portal." },
    { icon: PhoneIncoming, title: "Emergency Routing", description: "Always-on emergency numbers and direct lines to campus wardens." },
    { icon: BarChart3, title: "Usage Tracking", description: "Detailed logs allow administrators and parents to monitor call frequency and durations." },
    { icon: Users, title: "Multi-Hostel Management", description: "Manage thousands of students across different campus buildings from one dashboard." },
  ],
  benefits: [
    "Maintain campus discipline with automated time restrictions",
    "Give parents peace of mind with restricted dialing",
    "Eliminate manual phone billing with self-serve prepaid wallets",
    "Deploy ruggedized, tamper-proof SIP phones in common areas",
    "Ensure students always have access to emergency campus lines",
    "Scale effortlessly from 50 to 5,000+ students"
  ],
  useCases: ["Boarding Schools", "University Hostels", "Training Academies", "Seminaries"],
  faqs: [
    { q: "How do students make calls?", a: "Students enter their unique PIN on campus phones, which authenticates their account, checks their wallet balance, and allows them to dial their approved numbers." },
    { q: "Can parents restrict who the student calls?", a: "Yes. The system utilizes a strict whitelist. Students can only dial numbers that have been explicitly pre-approved by their parents or the administration." },
    { q: "What happens during class hours?", a: "Administrators can set global or hostel-specific schedules. During class or sleep hours, the phones will automatically block outbound calls (except for emergencies)." },
    { q: "How are funds added to the account?", a: "Parents get access to a secure online payment portal where they can instantly top up their child's calling wallet using standard payment methods." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Safe Communications", description: "Protect students from unwanted external calls and restrict outbound dialing to safe, verified family numbers." },
  { icon: Globe, title: "Parent Portal", description: "A dedicated web interface for parents to manage funds, update whitelisted numbers, and view call history." },
  { icon: Building, title: "Campus-Wide Scalability", description: "Centralized management for multiple hostel blocks, campuses, and hundreds of endpoints." },
  { icon: Radio, title: "Campus Intercom", description: "Double as a PA system to broadcast announcements to all hostel phones simultaneously." },
];

const MODULES_DATA = [
  {
    id: "management",
    iconColor: "text-blue-600",
    icon: Users,
    title: "Student & Directory Management",
    items: [
      { text: "Unique PIN authentication for every student", icon: Lock },
      { text: "Parent-managed whitelisted contact directories", icon: ListChecks },
      { text: "Bulk import for student onboarding and graduations", icon: Database },
      { text: "Always-allow emergency and warden routing", icon: AlertTriangle },
    ]
  },
  {
    id: "controls",
    iconColor: "text-amber-500",
    icon: Clock,
    title: "Schedules & Access Control",
    items: [
      { text: "Automated curfew and study-hour lockouts", icon: CalendarClock },
      { text: "Maximum call duration limits per session", icon: Hourglass }, 
      { text: "Hostel-specific or grade-specific policy rules", icon: Building },
      { text: "Instant system-wide lockdown capabilities", icon: ShieldCheck },
    ]
  },
  {
    id: "billing",
    iconColor: "text-emerald-500",
    icon: Landmark,
    title: "Prepaid Wallet System",
    items: [
      { text: "Self-serve parent recharge portal", icon: Globe },
      { text: "Automated low-balance notifications", icon: Bell },
      { text: "Per-minute billing based on domestic/international rates", icon: Percent },
      { text: "Transparent digital receipts and usage ledgers", icon: Receipt },
    ]
  }
];

export default function StudentCallingSystem() {
  return (
    <ProductPage
      data={PAGE_DATA}
      heroMedia={<HeroScene name="student" />}
      enterprise={ENTERPRISE_FEATURES}
      modules={MODULES_DATA}
      modulesTitle="Management Modules for Secure Communications"
      overviewLead="The Engine Behind"
      highlight={PAGE_DATA.title}
      featuresTitle={`Everything ${PAGE_DATA.title} gives you`}
      enterpriseTitle="Empowering managed communications with reliability and security."
      benefitsTitle="Why institutions choose it"
      ctaBody="Talk to our telephony experts and get a tailored demo for your campus within 24 hours."
    />
  );
}
