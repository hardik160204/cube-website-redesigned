import React from "react";
import {
  Smartphone, GitBranch, BarChart3, ShieldCheck, Gauge, Activity, Search, Lock, Users, Workflow, Percent, Building, AlertTriangle, CalendarClock, Mail, Clock, UserCog, Layers, Briefcase, LineChart, PhoneOff,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";

// Fallback dummy icon defined FIRST so it doesn't crash the data arrays
const FileText = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;

// =========================================================================
// CALL BILLING STANDARD SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Call Billing Software Standard",
  tagline: "Advanced billing rules, departmental tracking, and budget control for growing organizations.",
  heroVideo: "/billing-standard-image.png", 
  stats: [
    { value: "Groups", label: "Department Limits" },
    { value: "Dynamic", label: "Custom Tariffs" },
    { value: "Auto", label: "Scheduled Reports" },
  ],
  overview: [
    "Our Standard Call Billing Software steps up to meet the demands of mid-sized organizations. It moves beyond basic extension logging to provide deep departmental tracking, cost center allocation, and budget controls.",
    "Assign advanced routing tariffs, apply time-of-day cost variations, and set automatic budget limits to prevent runaway telecom expenses across different teams in your organization."
  ],
  features: [
    { icon: Users, title: "Departmental Grouping", description: "Group extensions into cost centers (Sales, Support, HR) for aggregated billing reports." },
    { icon: Gauge, title: "Budget Limits & Alerts", description: "Set monthly telecom budgets per department with automated email alerts when thresholds are reached." },
    { icon: Layers, title: "Advanced Tariff Rules", description: "Configure complex tariff plans including peak/off-peak pricing and destination-specific rates." },
    { icon: CalendarClock, title: "Scheduled Exports", description: "Automatically generate and email weekly or monthly reports directly to department heads." },
    { icon: ShieldCheck, title: "Authorization Codes", description: "Track calls made by roaming employees who use personal PINs to dial out from any desk." },
    { icon: Search, title: "Deep CDR Analytics", description: "Advanced filtering by duration, cost, destination, and trunk utilization metrics." },
  ],
  benefits: [
    "Hold department heads accountable for their team's telecom spend",
    "Prevent bill shock with proactive budget threshold alerts",
    "Save hours of manual accounting with automated email reports",
    "Accurately invoice clients for time spent on consultancy calls",
    "Optimize trunk lines by analyzing peak concurrent usage",
    "Support for roaming/hot-desking employees via auth codes"
  ],
  useCases: ["Mid-sized Enterprises", "Law Firms", "Multi-department Facilities", "Consultancy Agencies"],
  faqs: [
    { q: "Can we import our carrier's specific tariff rates?", a: "Yes, the Standard edition allows you to import and map your exact telecom provider's rate deck for precise cost calculation." },
    { q: "How do scheduled reports work?", a: "You can configure the system to automatically compile PDF or CSV reports and email them to specific managers on a daily, weekly, or monthly schedule." },
    { q: "Can we track calls by client or project?", a: "Yes. By utilizing account codes before dialing, the software can tag specific calls to client accounts for easy bill-back." },
    { q: "Is this suitable for a hotel?", a: "While this works for general tracking, our Enterprise or specific Hospitality integration module is recommended for direct PMS syncing." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: BarChart3, title: "Analytics Dashboard", description: "Interactive charts and widgets showing live telecom utilization across the organization." },
  { icon: Building, title: "Cost Center Allocation", description: "Easily export formatted data ready to be imported into your central ERP or accounting software." },
  { icon: PhoneOff, title: "Abandoned Call Tracking", description: "See which departments are missing calls to optimize staffing during peak hours." },
  { icon: Lock, title: "Role-Based Access", description: "Grant department managers access to view only their team's billing data." },
];

const MODULES_DATA = [
  {
    id: "organization",
    iconColor: "text-blue-600",
    icon: Building,
    title: "Organization & Grouping",
    items: [
      { text: "Multi-level hierarchy (Division > Dept > Ext)", icon: Layers },
      { text: "Dynamic extension mobility tracking (Auth codes)", icon: Smartphone },
      { text: "Client/Project account code tagging", icon: Briefcase },
      { text: "Role-based system access controls", icon: UserCog },
    ]
  },
  {
    id: "advanced-costing",
    iconColor: "text-amber-500",
    icon: Gauge,
    title: "Advanced Tariff & Budgets",
    items: [
      { text: "Time-of-day and day-of-week rate tables", icon: Clock },
      { text: "Carrier-specific LCR (Least Cost Routing) analysis", icon: GitBranch },
      { text: "Departmental hard and soft budget limits", icon: ShieldCheck },
      { text: "Markup rules for hospitality/client billing", icon: Percent },
    ]
  },
  {
    id: "automation",
    iconColor: "text-emerald-500",
    icon: Workflow,
    title: "Automation & Analytics",
    items: [
      { text: "Automated report generation and email delivery", icon: Mail },
      { text: "Trunk utilization and concurrent call analytics", icon: Activity },
      { text: "Fraud detection logic and instant alerts", icon: AlertTriangle },
      { text: "Historical trend analysis over multiple years", icon: LineChart },
    ]
  }
];

export default function CallBillingStandard() {
  return (
    <ProductPage
      data={PAGE_DATA}
      enterprise={ENTERPRISE_FEATURES}
      modules={MODULES_DATA}
      modulesTitle="Advanced Billing Modules"
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
