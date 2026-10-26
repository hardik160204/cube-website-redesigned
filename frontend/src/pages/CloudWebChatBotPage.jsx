import React from "react";
import { BarChart, Bot, CheckCircle2, Clock, Database, Globe, Headset, LayoutTemplate, MessageSquare, Network, ShieldCheck, TrendingUp, Users } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "web-chat-bot",
    title: <><Hi>Web Chat Bot</Hi></>,
    body: [
      "Convert your website visitors into loyal customers instantly. Deploy an intelligent AI chatbot to automate support, capture leads, and provide 24/7 assistance directly on your site.",
    ],
    button: "Deploy Your Bot Free",
  },
  {
    title: <>{"Turn Traffic into "}<Hi>Transactions</Hi></>,
    body: [
      "A Web Chat Bot is an interactive assistant that lives directly on your website. It engages visitors the moment they land on your page, answering questions, guiding them to products, and generating leads while you sleep.",
      "Whether you need a simple rule-based menu to route visitors or an advanced NLP-powered AI to handle complex queries, our web bots ensure no website visitor is ever left waiting for an answer.",
    ],
    tiles: [{ icon: MessageSquare, label: "Chat Widget" }, { icon: Bot, label: "AI Logic" }, { icon: Database, label: "CRM Sync" }, { icon: Headset, label: "Live Agent" }],
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use Web Bots?"}</>,
    cards: [
      { icon: Clock, title: "24/7 Customer Support", desc: "Instantly answer FAQs, provide pricing details, and resolve common issues around the clock without needing human agents on standby." },
      { icon: TrendingUp, title: "Proactive Lead Capture", desc: "Trigger automated greetings based on the page the user is viewing. Collect names, emails, and phone numbers directly in the chat window." },
      { icon: Database, title: "Automated Ticket Creation", desc: "If a user has a complex issue, the bot collects the necessary information and automatically generates a ticket in your CRM." },
      { icon: Globe, title: "Multilingual Assistance", desc: "Detect the user's browser language or let them select their preference, providing flawless automated support in multiple languages." },
      { icon: CheckCircle2, title: "Appointment Booking", desc: "Integrate with your calendar software. Allow website visitors to check availability and book meetings instantly through the chat widget." },
      { icon: Users, title: "Seamless Agent Transfer", desc: "When the bot detects frustration or a high-value query, it smoothly transfers the entire chat history to an available live human agent." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Design Your Flow", desc: "Use our visual drag-and-drop builder to create conversation paths, upload your FAQs, or connect it to your AI knowledge base." },
      { title: "Copy & Paste the Code", desc: "We provide a simple snippet of JavaScript. Just paste it into the header of your website, WordPress, or Shopify store." },
      { title: "Go Live & Analyze", desc: "The chat widget instantly appears on your site. Monitor live conversations, track lead conversions, and optimize responses from your dashboard." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>Web Chat Solution?</Hi></>,
    cards: [
      { icon: LayoutTemplate, title: "Custom Branding", desc: "Make it yours. Customize the widget's colors, avatar, sizing, and greeting messages to perfectly match your brand's UI." },
      { icon: Headset, title: "Unified Agent Inbox", desc: "If the bot gets stuck, it routes the chat to an omnichannel inbox where your human agents can take over seamlessly in real-time." },
      { icon: Database, title: "Webhook Integrations", desc: "Connect the bot to your existing backend. Push new leads directly to Salesforce, Hubspot, or custom database endpoints." },
      { icon: ShieldCheck, title: "GDPR & Data Security", desc: "Built with enterprise-grade security. Collect consent automatically and ensure all chat transcripts are encrypted and stored safely." },
      { icon: Globe, title: "Cross-Platform Ready", desc: "Our lightweight widget is optimized for both desktop and mobile browsers, ensuring a fast, frictionless experience on any device." },
      { icon: BarChart, title: "Conversation Analytics", desc: "Identify exactly where users drop off, what questions are asked most frequently, and how much agent time your bot is saving." },
    ],
  },
  {
    title: <>{"Types of "}<Hi>Web Architectures</Hi></>,
    cards: [
      { icon: LayoutTemplate, title: "Decision Tree Bots", desc: "Provide guided paths using predefined buttons and menus. Perfect for structured tasks like collecting lead information or navigating FAQs quickly." },
      { icon: Bot, title: "Generative AI Bots", desc: "Train the bot on your website URLs or PDF documents. Users can type open-ended questions, and the AI synthesizes an accurate, contextual answer instantly." },
      { icon: Network, title: "Hybrid Support Model", desc: "The bot acts as the frontline defense, handling 80% of routine queries. When a visitor needs human help, it smoothly transitions them to a live chat agent." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to automate your website support?",
    body: [
      "Stop losing leads and start engaging visitors 24/7. Deploy your intelligent web chat bot today.",
    ],
    button: "Build Your Bot Today",
  },
];

export default function CloudWebChatBotPage() {
  return <FlexPage sections={SECTIONS} />;
}
