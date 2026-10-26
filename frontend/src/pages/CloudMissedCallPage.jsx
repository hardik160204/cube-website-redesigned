import React from "react";
import { BarChart, BellRing, CheckCircle2, Clock, Database, Globe, MessageSquare, Network, PhoneCall, ShieldCheck, Smartphone, UserCheck, Users } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "missed-call",
    title: <><Hi>Missed Call Service</Hi></>,
    body: [
      "Capture high-quality leads at zero cost to your customers. Run instant verification campaigns, gather feedback, and generate instant opt-ins with a single missed call.",
    ],
    image: "/missed-call-service-hero.png", imageAlt: "Missed Call Service Illustration",
    button: "Start Free Trial",
  },
  {
    title: <>{"Zero-Cost "}<Hi>Lead Generation</Hi></>,
    body: [
      "A Missed Call Service provides a dedicated 10-digit virtual number or toll-free number for your business. When a customer dials this number, the call is automatically disconnected after one ring.",
      "Because the call doesn't connect, there is absolutely zero cost to the caller. Meanwhile, your system instantly captures their caller ID, time, and location, allowing you to trigger automated text messages or schedule outbound agent callbacks.",
    ],
    image: "/missed-call-service-illustration.svg", imageAlt: "Missed Call Service",
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use Missed Call?"}</>,
    cards: [
      { icon: BarChart, title: "Frictionless Lead Capture", desc: "Publish your missed call number on billboards or ads. Customers register interest simply by giving a missed call, filling your CRM with verified leads." },
      { icon: UserCheck, title: "COD & Number Verification", desc: "Reduce fake orders and spam accounts. Ask users to verify their mobile numbers by giving a missed call during the checkout or signup process." },
      { icon: Users, title: "Voting & Polling Campaigns", desc: "Assign different missed call numbers to different options. Users vote for their favorite by calling the specific number for free." },
      { icon: Clock, title: "Account Balance & Updates", desc: "Banks and financial apps use it to let users request their account balance. The system auto-replies with an SMS containing the requested data." },
      { icon: CheckCircle2, title: "Opt-In Subscriptions", desc: "Easily build compliance-friendly subscriber lists. Let customers opt-in for newsletters, alerts, and promotions via a quick missed call." },
      { icon: Smartphone, title: "App Download Links", desc: "Tired of broken URLs? Have users give a missed call to instantly receive a direct app download link tailored to their device OS." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Customer Dials the Number", desc: "The user dials your published 10-digit virtual number or toll-free number from their mobile device." },
      { title: "Auto-Disconnect at Zero Cost", desc: "The call rings once and is automatically disconnected by the server, ensuring the caller isn't charged a single penny." },
      { title: "Instant Automated Action", desc: "The caller ID is captured. Your system instantly sends an automated SMS response, alerts an agent, or updates your CRM." },
    ],
    steps: true,
  },
  {
    title: <>{"Why is a Missed Call Number essential "}<Hi>for your Business?</Hi></>,
    cards: [
      { icon: Network, title: "Multi-Channel Integration", desc: "Connect your missed call data instantly to email alerts, SMS gateways, and dialer queues." },
      { icon: Smartphone, title: "Accessible to Everyone", desc: "Works flawlessly on feature phones and smartphones alike without requiring internet access." },
      { icon: PhoneCall, title: "Automated Callbacks", desc: "Integrate directly with an auto-dialer to trigger instant reverse calls the moment a missed call drops." },
      { icon: Globe, title: "National Reach", desc: "Procure regional virtual numbers to give your brand a localized presence across various territories." },
      { icon: ShieldCheck, title: "100% Genuine Leads", desc: "Since users must physically dial from their device, you automatically verify their active phone number." },
      { icon: BarChart, title: "Detailed Dashboard", desc: "Track incoming volumes, unique vs repeat callers, and campaign performance in a live analytics dashboard." },
    ],
  },
  {
    title: <>{"Popular "}<Hi>Campaign Workflows</Hi></>,
    cards: [
      { icon: Database, title: "Lead Capture", desc: "The moment a missed call is received, the caller's details are injected straight into your CRM and assigned to the next available sales representative." },
      { icon: MessageSquare, title: "Auto-Responder SMS", desc: "Used for delivering automated information. Users give a missed call and instantly receive a customized SMS containing promo codes, links, or account updates." },
      { icon: BellRing, title: "Callback Queuing", desc: "During peak hours or after-hours, customers can leave a missed call to avoid holding. Their number is added to a queue, and an agent calls them back automatically." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to generate leads at zero cost?",
    body: [
      "Give your customers a frictionless way to reach out. Deploy a virtual missed call number today and watch your engagement soar.",
    ],
    button: "Get Your Number Today",
  },
];

export default function CloudMissedCallPage() {
  return <FlexPage sections={SECTIONS} />;
}
