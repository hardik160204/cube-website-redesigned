import React from "react";
import { FileText, Headphones, Lock, PhoneCall, ShieldCheck } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    label: "Financial Services",
    title: <>{"Secure Cloud Voice "}<Hi>for Banking & NBFCs</Hi></>,
    body: [
      "Deliver flawless customer experiences while maintaining absolute regulatory compliance. Cube Software provides encrypted logging, automated collections, and secure cloud PBX for modern financial institutions.",
    ],
    image: "/finance-industry-hero.svg", imageAlt: "Financial Services Cloud Telephony",
    button: "Book a Demo",
  },
  {
    label: "Why Financial Institutions Trust Us",
    title: "Enterprise-grade security meets limitless scalability",
    body: [
      "We understand that the financial sector cannot compromise on reliability. Our stack is engineered specifically for the high-stakes demands of banks, insurance firms, and trading floors.",
    ],
    cards: [
      { icon: ShieldCheck, title: "100% Regulatory Compliance", desc: "Tamper-proof call recording and encrypted voice logging to meet strict RBI and financial telecom regulations." },
      { icon: PhoneCall, title: "Automated Debt Collection", desc: "Deploy smart outbound auto-dialers and IVRs to automate payment reminders and boost collection rates effortlessly." },
      { icon: Lock, title: "Secure SIP Trunking", desc: "Enterprise-grade encrypted lines ensuring that highly sensitive customer data and transactions remain totally secure." },
      { icon: Headphones, title: "Centralized Support Floors", desc: "Manage customer support across multiple branches and cities from a single, unified cloud dashboard." },
    ],
  },
  {
    title: "Streamline your financial workflows.",
    body: [
      "From resolving customer disputes using verifiable voice logs to accelerating EMI collections without expanding your manual workforce, our platform is built for operational efficiency.",
    ],
    list: [
      "100% Secure Call Recording & Archiving",
      "Automated EMI & Credit Card Payment Reminders",
      "Priority VIP Routing for Wealth Management Clients",
      "Multi-Branch Unified Communication Systems",
    ],
    cards: [
      { icon: FileText, title: "Dispute Resolution", desc: "Retrieve encrypted recordings of customer trading instructions instantly." },
      { icon: PhoneCall, title: "Predictive Collections", desc: "Automatically dial overdue accounts and connect them to live recovery agents." },
    ],
  },
];

export default function FinanceIndustryPage() {
  return <FlexPage sections={SECTIONS} related />;
}
