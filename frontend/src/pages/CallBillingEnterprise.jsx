import React from "react";
import {
  GitBranch, BarChart3, ShieldCheck, Globe, Plug, Activity, LayoutDashboard, Database, HardDrive, Lock, Users, Receipt, Building, DatabaseZap, Layers, Headphones, BrainCircuit, LineChart,
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
// CALL BILLING ENTERPRISE SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Call Billing Software Enterprise",
  tagline: "Multi-site management with custom API integrations for large-scale and distributed deployments.",
  heroVideo: "/billing-enterprise-image.png", 
  stats: [
    { value: "Multi-Site", label: "PBX Syncing" },
    { value: "Full API", label: "PMS / ERP Integration" },
    { value: "High", label: "Availability Archiving" },
  ],
  overview: [
    "Our Enterprise Call Billing Software is a highly scalable, robust engine designed for large corporations, hospital networks, hotel chains, and universities. It centralizes telecom data across dozens of different physical sites and mixed PBX environments.",
    "Engineered for deep integration, the Enterprise edition features open APIs to seamlessly push billing data directly into your Property Management Systems (PMS), central ERP, or custom business intelligence tools."
  ],
  features: [
    { icon: Globe, title: "Centralized Multi-Site Logs", description: "Collect and unify call records from different branch offices and diverse PBX brands into one master database." },
    { icon: Plug, title: "API & PMS Integrations", description: "Push live call costs directly to hotel Property Management Systems (PMS) or corporate ERP software." },
    { icon: DatabaseZap, title: "Active Directory Sync", description: "Automatically update extension assignments and user data by syncing directly with Microsoft Active Directory." },
    { icon: Activity, title: "Real-time Traffic Analytics", description: "Live dashboards tracking SIP trunk health, concurrent channel usage, and network-wide bottlenecks." },
    { icon: ShieldCheck, title: "High-Availability Archiving", description: "Automated database backups and failover support to ensure zero data loss in massive telecom environments." },
    { icon: Users, title: "Multi-Tenant Capabilities", description: "Segment the database to allow different subsidiary companies to view only their own billing data." },
  ],
  benefits: [
    "Unify telecom billing across geographical borders and varied phone systems",
    "Automate guest billing in hospitality through flawless PMS syncing",
    "Eliminate manual IT work with automatic Active Directory user updates",
    "Identify under-utilized SIP trunks across the global network",
    "Customize data exports to feed directly into corporate BI tools",
    "Ensure massive databases remain lightning-fast and fully compliant"
  ],
  useCases: ["Hospitality Chains", "Global Corporations", "University Campuses", "Hospital Networks"],
  faqs: [
    { q: "Can it handle different brands of PBXs simultaneously?", a: "Yes. The Enterprise edition can parse CDR formats from Cisco, Avaya, Panasonic, Asterisk, and cloud platforms simultaneously into one unified dashboard." },
    { q: "What Property Management Systems (PMS) do you support?", a: "We support integrations with major hospitality platforms including Opera, Fidelio, and Protel via standard serial or IP-based middleware." },
    { q: "How is the data secured across multiple sites?", a: "Data is transmitted using encrypted IP protocols to the central server, which features automated redundancy and high-availability database clustering." },
    { q: "Do you offer custom reporting for Enterprise clients?", a: "Yes, our team can develop bespoke reporting templates and automated API webhooks tailored to your exact corporate compliance requirements." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Enterprise Grade Security", description: "End-to-end encryption, audit trails, and strict compliance with global telecom data protection regulations." },
  { icon: Layers, title: "Custom Middleware", description: "Need a unique integration? Our engineers can develop custom middleware to bridge the billing engine with proprietary systems." },
  { icon: Database, title: "Massive Scalability", description: "Engineered to handle millions of call records per month without performance degradation." },
  { icon: Headphones, title: "Priority Support SLA", description: "Enterprise clients receive priority 24/7 technical support and dedicated account management." },
];

const MODULES_DATA = [
  {
    id: "architecture",
    iconColor: "text-blue-600",
    icon: Globe,
    title: "Enterprise Architecture",
    items: [
      { text: "Centralized multi-site, multi-PBX data collection", icon: Layers },
      { text: "Active Directory and LDAP synchronization", icon: DatabaseZap },
      { text: "High-availability clustering and automated backups", icon: HardDrive },
      { text: "Multi-tenant segmentation for parent companies", icon: Users },
    ]
  },
  {
    id: "integration",
    iconColor: "text-amber-500",
    icon: Plug,
    title: "APIs & Integrations",
    items: [
      { text: "Direct PMS integration (Opera, Fidelio, etc.)", icon: Building },
      { text: "REST API for custom ERP/CRM data pushing", icon: GitBranch },
      { text: "Automated secure FTP (SFTP) batch exporting", icon: Lock },
      { text: "Custom webhook triggers for specific call events", icon: Activity },
    ]
  },
  {
    id: "intelligence",
    iconColor: "text-emerald-500",
    icon: BrainCircuit,
    title: "Business Intelligence",
    items: [
      { text: "Network-wide trunk capacity planning analytics", icon: BarChart3 },
      { text: "Custom dashboard creation for C-level executives", icon: LayoutDashboard },
      { text: "Advanced carrier reconciliation and audit reports", icon: Receipt },
      { text: "Predictive telecom cost modeling tools", icon: LineChart },
    ]
  }
];

export default function CallBillingEnterprise() {
  return (
    <ProductPage
      data={PAGE_DATA}
      enterprise={ENTERPRISE_FEATURES}
      modules={MODULES_DATA}
      modulesTitle="Enterprise Integration Modules"
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
