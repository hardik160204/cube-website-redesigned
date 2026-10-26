import React from "react";
import { BarChart, Bot, CheckCircle2, Clock, Database, ImageIcon, MessageCircle, Network, Send, ShieldCheck, ShoppingBag, TrendingUp, Users, Zap } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "whatsapp",
    title: <><Hi>WhatsApp API & Bot</Hi></>,
    body: [
      "Engage your customers where they already are. Build intelligent conversational workflows, automate customer support, and drive sales 24/7 through the official WhatsApp Business API.",
    ],
    button: "Get WhatsApp API",
  },
  {
    title: <>{"Conversational Commerce "}<Hi>Made Simple</Hi></>,
    body: [
      "A WhatsApp Chat Bot runs on the official WhatsApp Business API. It allows you to build automated, interactive chat workflows that instantly respond to customer queries, resolve issues, and collect lead data.",
      "Instead of forcing users to download an app or visit a website, you bring your business directly to their favorite messaging app. Transition smoothly from an automated AI bot to a live human agent whenever a complex issue arises.",
    ],
    tiles: [{ icon: MessageCircle, label: "Chat UX" }, { icon: Bot, label: "AI Logic" }, { icon: Database, label: "CRM Sync" }, { icon: Users, label: "Multi-Agent" }],
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use WhatsApp Bots?"}</>,
    cards: [
      { icon: Clock, title: "24/7 Customer Support", desc: "Automate answers to FAQs like business hours, location, and refund policies. Instantly resolve common issues without human intervention." },
      { icon: ShoppingBag, title: "E-Commerce & Orders", desc: "Send automated order confirmations, shipping updates, and delivery tracking links directly to the customer's WhatsApp inbox." },
      { icon: TrendingUp, title: "Lead Generation", desc: "Capture user details through a conversational flow. Automatically qualify leads and push their data instantly into your CRM." },
      { icon: Send, title: "Appointment Booking", desc: "Allow users to check availability and book appointments or reservations seamlessly through quick-reply buttons and list menus." },
      { icon: ImageIcon, title: "Rich Media Marketing", desc: "Send promotional broadcasts with interactive buttons, images, videos, and PDF catalogs to drive higher engagement and conversion rates." },
      { icon: Users, title: "HR & Internal Comms", desc: "Deploy internal bots for your employees to check leave balances, access company policies, or automate IT support tickets." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Connect the API", desc: "We link your official business phone number to the WhatsApp Business API and apply for your verified Green Tick profile." },
      { title: "Design Conversational Flows", desc: "Use our intuitive drag-and-drop builder to create response trees, interactive menus, and API webhooks linked to your software." },
      { title: "Launch & Automate", desc: "Go live. The bot instantly handles thousands of simultaneous chats, routing complex inquiries to a unified live-agent inbox." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>WhatsApp Solution?</Hi></>,
    cards: [
      { icon: CheckCircle2, title: "Green Tick Verification", desc: "Build unparalleled trust. We assist eligible brands in securing the official WhatsApp Green Tick verification badge next to their profile name." },
      { icon: Users, title: "Multi-Agent Shared Inbox", desc: "Connect a single WhatsApp number to multiple customer support agents simultaneously. View, assign, and resolve chats collaboratively." },
      { icon: Database, title: "API & CRM Integration", desc: "Seamlessly connect the chatbot to Shopify, Salesforce, Zoho, or your custom ERP to push and pull data directly within the chat interface." },
      { icon: ImageIcon, title: "Rich Interactive Media", desc: "Go beyond plain text. Send clickable quick-reply buttons, product catalogs, list menus, location pins, and PDF documents." },
      { icon: ShieldCheck, title: "Enterprise Grade Security", desc: "Maintain strict data privacy compliance. All API communications leverage WhatsApp's robust end-to-end encryption protocols." },
      { icon: BarChart, title: "Analytics & Dashboards", desc: "Track message delivery rates, read receipts, bot drop-off points, and human-agent resolution times via a comprehensive dashboard." },
    ],
  },
  {
    title: <>{"Types of "}<Hi>Bot Architectures</Hi></>,
    cards: [
      { icon: Bot, title: "Rule-Based Bots", desc: "Provide guided paths using predefined buttons and menus. Perfect for structured tasks like collecting lead information, booking appointments, or navigating FAQs." },
      { icon: Zap, title: "NLP / AI Bots", desc: "Powered by Natural Language Processing (NLP). Users can type open-ended questions like \"Where is my order?\" and the AI understands intent to fetch the correct data." },
      { icon: Network, title: "Hybrid Support Model", desc: "The bot acts as the frontline defense, handling 80% of routine queries. When an issue requires empathy or complex troubleshooting, it seamlessly transfers chat history to a live agent." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to engage 2 Billion+ WhatsApp users?",
    body: [
      "Transform how you communicate with your customers. Automate support, blast promotional messages, and scale your brand globally today.",
    ],
    button: "Get Started with WhatsApp API",
  },
];

export default function CloudWhatsappBotPage() {
  return <FlexPage sections={SECTIONS} />;
}
