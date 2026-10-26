import React from "react";
import {
  BarChart3, ShieldCheck, Plug, Landmark, PhoneIncoming, ListChecks, Database, Search, HardDrive, Users, Receipt, Percent, AlertTriangle, FileSpreadsheet, CalendarClock, Clock, Phone, PhoneOff,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";

// Fallback dummy icon defined FIRST so it is initialized before MODULES_DATA
const FileText = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

// =========================================================================
// CALL BILLING BASIC SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Call Billing Software Basic",
  tagline: "Essential telecom resource & cost management for single-office operations and small teams.",
  heroVideo: "/billing-basic-image.png", 
  stats: [
    { value: "100%", label: "Call Visibility" },
    { value: "Automated", label: "Cost Reports" },
    { value: "Plug & Play", label: "Deployment" },
  ],
  overview: [
    "Our Basic Call Billing Software provides essential visibility into your telecom usage and costs. Designed specifically for single-office setups and small businesses, it eliminates blind spots in your monthly telecom expenses.",
    "Easily track incoming and outgoing calls, monitor extension-wise usage, and generate straightforward reports to understand exactly where your communication budget is being spent without complex configurations."
  ],
  features: [
    { icon: Phone, title: "Extension Tracking", description: "Monitor inbound and outbound call activity for every individual extension in your office." },
    { icon: Receipt, title: "Cost Calculation", description: "Apply basic tariff rates to instantly calculate the cost of every outgoing call." },
    { icon: FileSpreadsheet, title: "Standard Reports", description: "Generate daily, weekly, or monthly usage reports in PDF or CSV formats." },
    { icon: Search, title: "Call Detail Records (CDR)", description: "Searchable database of all call logs including time, duration, caller ID, and dialed numbers." },
    { icon: ShieldCheck, title: "Toll Fraud Detection", description: "Basic alerts for unusually long or expensive international calls." },
    { icon: HardDrive, title: "Local Archiving", description: "Securely store your call records locally for basic compliance and historical review." },
  ],
  benefits: [
    "Identify personal or unauthorized calls instantly",
    "Allocate basic telecom costs to specific extensions",
    "Deploy quickly with minimal IT infrastructure required",
    "Reduce overall phone bills by creating usage awareness",
    "Easy-to-use interface designed for non-technical staff",
    "Compatible with most standard office PBX systems"
  ],
  useCases: ["Small Businesses", "Single-location Offices", "Boutique Hotels", "Local Clinics"],
  faqs: [
    { q: "Do I need complex hardware for this?", a: "No, the Basic version is designed to connect directly to your existing compatible PBX with minimal setup." },
    { q: "Can I export the billing reports?", a: "Yes, all standard reports can be easily exported to PDF or CSV for your accounting software." },
    { q: "Does it track internal calls?", a: "Yes, it tracks all extension-to-extension calls as well as external inbound and outbound traffic." },
    { q: "Can we upgrade later?", a: "Absolutely. You can seamlessly upgrade your license to Standard or Enterprise as your business grows without losing historical data." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Secure Access", description: "Password-protected admin dashboard ensures only authorized personnel can view call costs." },
  { icon: BarChart3, title: "Clear Dashboards", description: "Visual graphs showing peak call times and highest-cost extensions at a glance." },
  { icon: Clock, title: "Automated Logging", description: "Runs quietly in the background, automatically pulling CDR data without manual intervention." },
  { icon: PhoneIncoming, title: "Trunk Utilization", description: "Basic views to show if you have too many or too few phone lines for your traffic." },
];

const MODULES_DATA = [
  {
    id: "tracking",
    iconColor: "text-blue-600",
    icon: Phone,
    title: "Call Tracking & Logging",
    items: [
      { text: "Real-time capture of CDR (Call Detail Records)", icon: Database },
      { text: "Extension, trunk, and dialed number logging", icon: ListChecks },
      { text: "Call duration and timestamp tracking", icon: Clock },
      { text: "Unanswered and abandoned call basic logs", icon: PhoneOff },
    ]
  },
  {
    id: "costing",
    iconColor: "text-emerald-500",
    icon: Landmark,
    title: "Cost Management",
    items: [
      { text: "Standard local and long-distance tariff tables", icon: Percent },
      { text: "Extension-wise cost accumulation", icon: Users },
      { text: "Top expensive calls summary", icon: AlertTriangle },
      { text: "Basic currency and tax configurations", icon: Receipt },
    ]
  },
  {
    id: "reporting",
    iconColor: "text-amber-500",
    icon: FileSpreadsheet,
    title: "Reporting & Export",
    items: [
      { text: "Pre-built standard summary reports", icon: BarChart3 },
      { text: "Date-range filtering for specific billing cycles", icon: CalendarClock },
      { text: "One-click CSV and PDF exports", icon: HardDrive },
      { text: "Basic print-ready formatting", icon: FileText },
    ]
  }
];

export default function CallBillingBasic() {
  return (
    <ProductPage
      data={PAGE_DATA}
      enterprise={ENTERPRISE_FEATURES}
      modules={MODULES_DATA}
      modulesTitle="Essential Billing Modules"
      overviewLead="The Engine Behind"
      highlight={PAGE_DATA.title}
      overviewImage="/products/call-billing.jpg"
      featuresTitle={`Everything ${PAGE_DATA.title} gives you`}
      enterpriseTitle="Empowering managed communications with reliability and security."
      benefitsTitle="Why institutions choose it"
      ctaBody="Talk to our telephony experts and get a tailored demo within 24 hours."
    />
  );
}
