import React from "react";
import {
  Receipt, Percent, Building, AlertTriangle, FileSpreadsheet, MonitorPlay, ShieldCheck, Plug, Headphones, BrainCircuit,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";

// =========================================================================
// CALL BILLING SOFTWARE SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Call Billing Software",
  tagline: "Take command of telecom resources and costs across every office, hotel and facility.",
  heroVideo: "/call-billing-bg.mp4", // <-- UPDATE THIS TO YOUR VIDEO FILE NAME
  overviewImage: "/call-billing-overview.png", // <-- UPDATE THIS TO YOUR LEFT-SIDE OVERVIEW IMAGE
  stats: [
    { value: "Serial/IP/File", label: "CDR OUTPUT" },
    { value: "Yes", label: "SUPPORT HOTEL/HOSPITALS" },
    { value: "Small/Enterprise", label: "TYPE" },
  ],
  overview: [
    "Cube Call Billing Software provides transparent, automated call accounting and rating for enterprises, hotels, hospitals and shared offices. Track every extension, trunk and gateway to understand usage patterns, apportion telecom expenses accurately and eliminate billing leakages.",
    "With support for multi-currency rating, customized tariff tables, department-wise budgeting, automated PDF invoice generation and detailed CDR (Call Detail Record) reporting, you gain complete financial command over your organization's voice traffic.",
  ],
  features: [
    { icon: Receipt, title: "Automated Rating", description: "Instantly calculate call costs using flexible tariff and surcharges tables." },
    { icon: Percent, title: "Multi-Currency & Tax", description: "Support global operations with multi-currency rating and tax calculations." },
    { icon: Building, title: "Department Budgets", description: "Allocate budgets per department, extension or client account with alerts." },
    { icon: AlertTriangle, title: "Fraud & Abuse Detection", description: "Flag unauthorized long-distance calls, spike alerts and toll fraud instantly." },
    { icon: FileSpreadsheet, title: "Scheduled Reports", description: "Automated PDF/Excel reports delivered to finance teams on schedule." },
    { icon: MonitorPlay, title: "PMS Integration", description: "Seamless interface with hotel Property Management Systems for guest billing." },
  ],
  benefits: [
    "Eliminate unauthorized telephone use and toll fraud",
    "Accurately charge back telecom costs to departments or clients",
    "Automate guest billing for hotels and hospitality venues",
    "Detailed CDR logs for every extension and trunk line",
    "Flexible tariff engine adapts to any carrier rate sheet",
    "Significant reduction in monthly telecom expenditure",
  ],
  useCases: ["Corporate offices & branches", "Hotels & hospitality suites", "Shared office spaces & incubators", "Hospitals & campuses"],
  faqs: [
    { q: "What is Call Billing Software and how does it work?", a: "Call Billing Software captures Call Detail Records (CDRs) from your PBX or telecom gateway via IP, Serial, or File interface, instantly calculating call costs based on customizable tariff tables and tax rates." },
    { q: "Can it integrate with our existing PBX or IP-PBX system?", a: "Yes, our billing platform interfaces seamlessly with all leading PBX and IP-PBX systems, including Cisco, Asterisk, Avaya, Mitel, Panasonic, and legacy PABX switches." },
    { q: "How does the system help prevent telecom fraud and misuse?", a: "The software features built-in anomaly and abuse detection that instantly alerts administrators about unauthorized international/premium numbers, after-hours usage spikes, and unusual calling patterns." },
    { q: "Can we track and allocate budgets per department or extension?", a: "Absolutely. You can set individual spending caps and monthly budgets for specific departments, cost centers, or employee extensions, complete with automated threshold alerts." },
    { q: "Does it support PMS integration for hotel and hospitality guest billing?", a: "Yes, it offers bi-directional Property Management System (PMS) integration to automatically post telephone charges directly to guest room folios in real time." },
    { q: "What reporting formats are available for accounting and audits?", a: "The platform generates comprehensive CDR reports and itemized invoices exportable in PDF, Excel, CSV, and HTML formats, with options for automated scheduled email delivery to finance teams." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Enterprise Security", description: "Encrypted protocols, fraud monitoring and hardened infrastructure that protect every financial transaction and CDR log." },
  { icon: Plug, title: "PBX Integration", description: "Plug into Asterisk, Cisco, Avaya, Mitel, and traditional PABX platforms seamlessly." },
  { icon: Headphones, title: "24/7 Support", description: "Never skip a beat. Secure 24/7 dedicated support for your billing and accounting infrastructure." },
  { icon: BrainCircuit, title: "Smart Analytics", description: "Elevate your accounting with predictive cost trends, anomaly detection, and automated report dispatch." },
];

export default function CallBillingSoftware() {
  return <ProductPage data={PAGE_DATA} enterprise={ENTERPRISE_FEATURES} highlight="Call Accounting" />;
}
