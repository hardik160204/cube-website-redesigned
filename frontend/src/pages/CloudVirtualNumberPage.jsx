import React from "react";
import { Briefcase, Building2, Cloud, Database, Globe, LineChart, MapPin, MessageSquare, Mic, Network, PhoneForwarded, ShieldCheck, Smartphone, Users, Voicemail } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "virtual-number",
    title: <><Hi>Virtual Numbers</Hi></>,
    body: [
      "Establish a local presence anywhere in the world without a physical office. Route calls intelligently, track marketing ROI, and never miss a business opportunity.",
    ],
    button: "Get Your Number",
  },
  {
    title: <>{"Business Telephony "}<Hi>Without Hardware</Hi></>,
    body: [
      "A Virtual Number is a telephone number that isn't tied to a specific phone line or physical device. Instead, it lives entirely in the cloud and redirects incoming calls to any mobile phone, landline, or IP device you choose.",
      "It allows businesses to project a professional, established image. You can purchase a local city code in New York while sitting in London, ensuring local customers feel comfortable calling a familiar regional number.",
    ],
    tiles: [{ icon: Cloud, label: "Cloud Hosted" }, { icon: PhoneForwarded, label: "Any Device" }, { icon: MapPin, label: "Local ID" }, { icon: ShieldCheck, label: "Private" }],
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use Virtual Numbers?"}</>,
    cards: [
      { icon: MapPin, title: "Establish Local Presence", desc: "Buy virtual numbers with local area codes in multiple cities to build trust and show a local presence without opening physical branch offices." },
      { icon: LineChart, title: "Marketing Call Tracking", desc: "Assign unique virtual numbers to different marketing campaigns (Facebook, Billboards, Print) to accurately track which channels generate the most calls." },
      { icon: Users, title: "Remote Team Enablement", desc: "Give remote employees a professional business number that forwards to their personal mobile phones, keeping business and personal calls entirely separate." },
      { icon: ShieldCheck, title: "Call Masking & Privacy", desc: "Used by ride-sharing and delivery apps to connect drivers and customers without revealing either party's personal phone number." },
      { icon: Briefcase, title: "Professional Image", desc: "Ditch the personal mobile number. Use a virtual number equipped with a corporate IVR greeting to sound like a Fortune 500 company." },
      { icon: PhoneForwarded, title: "Disaster Recovery", desc: "If your primary office goes offline, virtual numbers allow you to instantly reroute all business calls to backup locations or mobile devices." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Select Your Number", desc: "Choose a local, national, or mobile virtual number from our extensive global inventory via the dashboard." },
      { title: "Set Your Routing Rules", desc: "Map the virtual number to your existing mobile phones, landlines, or SIP endpoints. Set up IVR greetings and business hours." },
      { title: "Receive & Track Calls", desc: "When a customer dials the virtual number, the call is instantly routed to your chosen device, while call data is logged in real-time." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>Virtual Numbers?</Hi></>,
    cards: [
      { icon: Mic, title: "Custom IVR Integration", desc: "Greet callers with a studio-recorded welcome message and route them to different departments using an interactive menu." },
      { icon: Network, title: "Simultaneous Ringing", desc: "Route incoming calls to multiple agents' phones at the same time. The first agent to pick up gets connected to the customer." },
      { icon: Database, title: "Call Recording", desc: "Automatically record all incoming and outgoing conversations on your virtual number for quality assurance and compliance purposes." },
      { icon: Voicemail, title: "Voicemail-to-Email", desc: "If a call is missed after business hours, callers can leave a voicemail. The audio file is instantly emailed to your inbox." },
      { icon: LineChart, title: "Real-Time Analytics", desc: "Gain deep insights into your call traffic. Monitor answered vs. missed calls, peak hours, and individual agent performance." },
      { icon: MessageSquare, title: "SMS Enabled", desc: "Choose mobile virtual numbers that support two-way SMS, allowing you to trigger text receipts or handle customer chat seamlessly." },
    ],
  },
  {
    title: <>{"Types of "}<Hi>Virtual Numbers</Hi></>,
    cards: [
      { icon: Building2, title: "Local City Numbers", desc: "Numbers with specific geographic area codes (e.g., 011 for Delhi, 022 for Mumbai). Best for targeting specific local demographics and building regional trust." },
      { icon: Globe, title: "National Numbers", desc: "Non-geographic numbers that don't tie your business to a specific city. Ideal for organizations aiming for a nationwide, standardized presence." },
      { icon: Smartphone, title: "Mobile Virtual Numbers", desc: "Ten-digit virtual mobile numbers that look like standard cell numbers. Often required for services that rely heavily on SMS integration and two-way texting." },
    ],
  },
  {
    kind: "cta",
    title: "Take your business phone to the cloud.",
    body: [
      "Stop giving out personal cell numbers. Establish a professional presence, track your marketing, and route calls intelligently today.",
    ],
    button: "Browse Available Numbers",
  },
];

export default function CloudVirtualNumberPage() {
  return <FlexPage sections={SECTIONS} />;
}
