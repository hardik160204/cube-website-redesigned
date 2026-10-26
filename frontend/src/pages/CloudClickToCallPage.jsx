import React from "react";
import { BarChart, Code, Database, Globe, Headset, LayoutTemplate, Mail, Mic, MousePointerClick, PhoneForwarded, RefreshCw, Repeat, ShieldCheck, ShoppingCart, Smartphone, Zap } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "click-to-call",
    title: <><Hi>Click to Call</Hi></>,
    body: [
      "Connect with customers instantly. Embed a click-to-call button on your website, app, or CRM to bridge calls instantly, eliminate dial times, and boost conversion rates.",
    ],
    image: "/click-to-call.png", imageAlt: "Click to Call Workflow Illustration",
    button: "Deploy Widget Free",
  },
  {
    title: <>{"Frictionless "}<Hi>Voice Connectivity</Hi></>,
    body: [
      "Click to Call is a seamless cloud telephony feature that allows a person to click a button on a website, app, or CRM to initiate an instant phone call. No manual dialing is required.",
      "When triggered, the system instantly calls the agent first, and upon answering, immediately bridges the call to the customer. It eliminates dialing errors, increases outbound agent efficiency by 40%, and drastically lowers website drop-off rates.",
    ],
    tiles: [{ icon: MousePointerClick, label: "1-Click" }, { icon: PhoneForwarded, label: "Auto-Dial" }, { icon: Zap, label: "Zero Wait" }, { icon: Code, label: "Easy API" }],
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use Click to Call?"}</>,
    cards: [
      { icon: Globe, title: "Website Lead Generation", desc: "Embed a call button on your landing pages. Visitors simply enter their number, and the system instantly connects them to your sales team." },
      { icon: Database, title: "CRM Outbound Dialing", desc: "Sales agents click phone icons directly inside Salesforce or Zoho. The system auto-dials, saving hours of manual data entry every week." },
      { icon: ShoppingCart, title: "E-Commerce Support", desc: "Place a 'Talk to an Expert' button on checkout pages to help customers resolve final doubts and reduce cart abandonment." },
      { icon: Mail, title: "Email Campaigns", desc: "Embed click-to-call links directly into your email signatures and promotional newsletters to drive immediate inbound inquiries." },
      { icon: Smartphone, title: "In-App Connectivity", desc: "Integrate our API into your iOS or Android app, allowing users to contact support without leaving the application interface." },
      { icon: Headset, title: "Support Helpdesks", desc: "Allow support agents working in Zendesk or Freshdesk to initiate voice calls directly from a customer's support ticket." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Trigger the Request", desc: "A customer enters their number on your website widget, or an agent clicks a phone icon inside your CRM platform." },
      { title: "System Dials Agent First", desc: "Our cloud server instantly calls the assigned agent's phone. Once the agent picks up, a brief prompt can announce the caller." },
      { title: "Call is Bridged", desc: "The server immediately dials the customer's number and bridges the two parties together in a high-definition, recorded call." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>Click to Call?</Hi></>,
    cards: [
      { icon: ShieldCheck, title: "Two-Way Call Masking", desc: "Protect privacy on both ends. Neither the customer nor the agent can see each other's actual phone numbers during the bridged call." },
      { icon: RefreshCw, title: "Automatic CRM Sync", desc: "Every clicked call automatically creates an activity log in your CRM, logging timestamps, agent details, and call duration natively." },
      { icon: BarChart, title: "Real-Time Analytics", desc: "Track how many website visitors requested a callback, agent response times, and conversion rates directly from your unified dashboard." },
      { icon: Mic, title: "Call Recording", desc: "Record 100% of bridged conversations securely to the cloud. Perfect for quality assurance, agent training, and dispute resolution." },
      { icon: LayoutTemplate, title: "Customizable Widget", desc: "Design the web widget to match your brand. Customize colors, text, popup behavior, and set specific operating hours for callbacks." },
      { icon: Repeat, title: "Automated Retries", desc: "If the customer doesn't pick up the initial bridge, the system can automatically schedule and initiate a retry attempt later." },
    ],
  },
  {
    title: <>{"Implementation "}<Hi>Methods</Hi></>,
    cards: [
      { icon: LayoutTemplate, title: "Website Widget", desc: "A simple snippet of code pasted into your website's header. It displays a floating phone button that visitors can click to request an instant callback from your team." },
      { icon: Database, title: "CRM Browser Extension", desc: "A lightweight Chrome extension that turns every phone number on your screen (inside CRMs, spreadsheets, or web pages) into a clickable dialing link for agents." },
      { icon: Code, title: "Native API Integration", desc: "Build the click-to-call logic directly into the backend of your proprietary mobile app or software using our robust REST APIs and webhooks." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to eliminate dialing errors?",
    body: [
      "Speed up your sales cycle and capture website leads instantly. Deploy your click-to-call solution in minutes.",
    ],
    button: "Get Started Today",
  },
];

export default function CloudClickToCallPage() {
  return <FlexPage sections={SECTIONS} />;
}
