import React from "react";
import { Box, Code, Database, FileText, Filter, Globe, Headset, Layers, LifeBuoy, Monitor, MousePointer, Puzzle, Settings, ShieldCheck } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "crm",
    title: <><Hi>CRM Integration</Hi></>,
    body: [
      "Unify your communications and customer data. Connect your cloud telephony seamlessly with Salesforce, HubSpot, Zoho, and custom ERPs to empower your sales and support teams.",
    ],
    image: "/crm-integration-hero.svg", imageAlt: "CRM Integration",
    button: "Explore Integrations",
  },
  {
    title: <>{"Bridge the Gap Between "}<Hi>Calls</Hi>{" "}<Hi>& Data</Hi></>,
    body: [
      "CRM Integration connects your cloud telephony platform directly into your Customer Relationship Management software. Instead of agents manually toggling between a dialer and a database, everything happens in one unified interface.",
      "Every incoming call automatically fetches the caller's profile, every outgoing call can be made with a single click, and all call logs and recordings are instantly pushed back into the customer's CRM record.",
    ],
    image: "/crm-integration-illustration.svg", imageAlt: "CRM Integration Telephony",
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use CRM Sync?"}</>,
    cards: [
      { icon: MousePointer, title: "Click-to-Call", desc: "Eliminate manual dialing errors. Agents simply click a phone icon inside Salesforce or Zoho to instantly dial the customer." },
      { icon: Monitor, title: "Incoming Screen Pops", desc: "When a customer calls, their CRM profile instantly pops up on the agent's screen, providing full context before they say 'Hello'." },
      { icon: FileText, title: "Automated Call Logging", desc: "Say goodbye to manual data entry. Call duration, timestamps, and agent notes are automatically logged into the CRM." },
      { icon: Headset, title: "Helpdesk Ticket Creation", desc: "For support teams, a missed call or a specific IVR input can automatically generate a new ticket in Zendesk or Freshdesk." },
      { icon: Database, title: "Call Recording Sync", desc: "Access call recordings directly from the CRM timeline. Managers can review agent performance without switching platforms." },
      { icon: Filter, title: "Intelligent Call Routing", desc: "Query the CRM in real-time. If the caller is marked as 'VIP' or has an 'Open Ticket', route them directly to their dedicated account manager." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Authenticate & Connect", desc: "Select your CRM from our marketplace and authenticate via OAuth or secure API keys with just a few clicks." },
      { title: "Map Workflows & Triggers", desc: "Define what happens during a call. Choose to auto-create leads on missed calls or push call recordings upon completion." },
      { title: "Real-Time Synchronization", desc: "Go live. Your agents can now work entirely inside the CRM interface while our cloud servers handle the telephony infrastructure in the background." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>Integration Architecture?</Hi></>,
    cards: [
      { icon: Puzzle, title: "Zero-Code Setup", desc: "Connect natively to top CRMs like Salesforce, Zoho, and HubSpot without needing a developer to write a single line of code." },
      { icon: Code, title: "Custom Webhooks", desc: "Using a proprietary, in-house CRM? We provide robust webhooks and REST APIs to push real-time call events directly to your endpoint." },
      { icon: Layers, title: "Bi-Directional Sync", desc: "Information flows both ways. Telephony events update the CRM, while CRM data (like lead owner) dictates how telephony routes the call." },
      { icon: Settings, title: "Custom Parameter Passing", desc: "Pass customized fields, tags, and campaign identifiers from your dialer directly into specific custom fields within your CRM framework." },
      { icon: ShieldCheck, title: "Enterprise Security", desc: "We utilize SSL/TLS encryption for all data transit between your CRM and our cloud telephony servers to ensure maximum data protection." },
      { icon: Globe, title: "Browser Agnostic", desc: "Our lightweight CTI (Computer Telephony Integration) pop-ups work perfectly across Chrome, Firefox, Edge, and Safari without heavy plugins." },
    ],
  },
  {
    title: <>{"Supported "}<Hi>Architectures</Hi></>,
    cards: [
      { icon: Box, title: "Sales CRMs", desc: "Native plug-and-play apps available for industry leaders including Salesforce, HubSpot, Zoho CRM, Pipedrive, and LeadSquared." },
      { icon: LifeBuoy, title: "Helpdesk Software", desc: "Enhance your customer support. Deep integrations available for Zendesk, Freshdesk, Kapture, and Zoho Desk to automate ticket creation." },
      { icon: Code, title: "Custom ERP / APIs", desc: "Have a proprietary software? Use our comprehensive developer documentation, REST APIs, and Webhooks to build your own seamless CTI integration." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to unify your sales ecosystem?",
    body: [
      "Stop losing data between tabs. Integrate your cloud telephony with your CRM today to boost agent efficiency and capture every interaction.",
    ],
    button: "Connect Your CRM Today",
  },
];

export default function CloudCrmIntegrationPage() {
  return <FlexPage sections={SECTIONS} />;
}
