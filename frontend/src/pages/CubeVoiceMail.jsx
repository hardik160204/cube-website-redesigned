import React from "react";
import {
  Voicemail, Mail, Forward, Clock, Languages, Plug, ShieldCheck, Headphones, BrainCircuit,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";

// =========================================================================
// CUBE VOICE MAIL SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Cube Voice Mail",
  tagline: "Never miss a message — exchange, deliver and process voice messages automatically.",
  heroVideo: "/cube-voice-mail-bg.mp4", 
  overviewImage: "/cube-voice-mail-overview.png", 
  stats: [
    { value: "24/7", label: "Message Capture" },
    { value: "Email", label: "Delivery Built-in" },
    { value: "Multi-Lang", label: "Prompts" },
  ],
  overview: [
    "Cube Voice Mail is a computer-based system that lets users and subscribers exchange personal voice messages, select and deliver voice information, and process transactions by phone. Every caller gets answered — even at 3 a.m. on a holiday.",
    "Personal greetings, password-protected mailboxes, message forwarding and voicemail-to-email keep teams responsive. Broadcast lists deliver announcements to hundreds of mailboxes at once, while IVR hooks let callers act on information, not just leave messages.",
  ],
  features: [
    { icon: Voicemail, title: "Personal Mailboxes", description: "Private, PIN-protected boxes with custom greetings per user." },
    { icon: Mail, title: "Voicemail-to-Email", description: "Messages arrive in inboxes as audio attachments instantly." },
    { icon: Forward, title: "Forward & Broadcast", description: "Route messages to colleagues or blast announcements to groups." },
    { icon: Clock, title: "Time-Based Greetings", description: "Different greetings for office hours, nights and holidays." },
    { icon: Languages, title: "Multi-Language Prompts", description: "Serve callers in the language they prefer." },
    { icon: Plug, title: "PBX Integration", description: "Message-waiting lamps and dial-in access on any major PBX." },
  ],
  benefits: [
    "Capture every after-hours and overflow call",
    "Respond faster with email-delivered messages",
    "Professional image with custom greetings",
    "Reduce receptionist load dramatically",
    "Process simple transactions without agents",
    "Scales to thousands of mailboxes",
  ],
  useCases: ["Corporate reception overflow", "After-hours support lines", "Hotels & hospitals", "Employee broadcast systems"],
  faqs: [
    { q: "What is Cube Voice Mail?", a: "Cube Voice Mail is an enterprise-grade system that allows users to capture, manage, and route voice messages 24/7, ensuring no customer inquiry goes unanswered." },
    { q: "Can I receive voice messages in my email?", a: "Yes, our Voicemail-to-Email feature automatically delivers recorded voice messages directly to your inbox as audio attachments for immediate review." },
    { q: "Is it possible to set different greetings for after-hours?", a: "Absolutely. You can configure time-based greetings to play different messages during office hours, nights, weekends, and holidays." },
    { q: "Does it support multiple languages?", a: "Yes, Cube Voice Mail supports multi-language prompts, allowing you to serve your callers in their preferred language natively." },
    { q: "Can I broadcast a message to multiple employees at once?", a: "Yes, the broadcast feature allows you to send a single voice announcement to hundreds of mailboxes simultaneously, perfect for internal team updates." },
    { q: "Will this integrate with my existing PBX system?", a: "Our system is highly compatible and integrates seamlessly with all major PBX systems, supporting features like message-waiting indicators and direct dial-in access." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Enterprise Security", description: "Encrypted protocols, fraud monitoring and hardened infrastructure that protect every conversation your teams have." },
  { icon: Plug, title: "Email Integration", description: "Plug into your existing corporate email servers seamlessly through clean, well-documented protocols." },
  { icon: Headphones, title: "24/7 Support", description: "Never skip a beat. Secure 24/7 dedicated support for your critical business communications." },
  { icon: BrainCircuit, title: "Smart Routing", description: "Elevate your team with smart prompt routing, clear audio quality, and automated controls." },
];

export default function CubeVoiceMail() {
  return <ProductPage data={PAGE_DATA} enterprise={ENTERPRISE_FEATURES} highlight="Voice Messaging" />;
}
