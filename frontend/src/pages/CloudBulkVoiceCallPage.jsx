import React from "react";
import { BarChart, CheckCircle2, Clock, Database, Languages, ListChecks, Maximize, Megaphone, Mic, Network, PhoneCall, ShieldCheck, TrendingUp, Users } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "bulk-voice",
    title: <><Hi>Bulk Voice Calls</Hi></>,
    body: [
      "Reach thousands of customers instantly with pre-recorded voice messages. Automate your announcements, promotional offers, and reminders with just one click.",
    ],
    image: "/bulk-voice-call-hero.png", imageAlt: "Bulk Voice Calls Illustration",
    button: "Start Free Trial",
  },
  {
    title: <>{"Mass Communication "}<Hi>Made Simple</Hi></>,
    body: [
      "Bulk Voice Calling, also known as voice broadcasting, is a technology that allows you to send a pre-recorded voice message to hundreds or thousands of call recipients simultaneously.",
      "It is the most cost-effective and rapid way to deliver alerts, promotional offers, political campaigns, and reminders, ensuring your message is heard in your own voice, adding a personal touch to your mass outreach.",
    ],
    image: "/mass-communication-illustration.svg", imageAlt: "Bulk Voice Call Broadcasting",
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use Voice Broadcasting?"}</>,
    cards: [
      { icon: Users, title: "Political & Social Campaigns", desc: "Reach thousands of voters or community members instantly with pre-recorded messages directly from candidates or leaders." },
      { icon: Clock, title: "EMI & Bill Reminders", desc: "Automate your collection process by scheduling voice broadcasts to remind customers of upcoming or overdue payments." },
      { icon: Megaphone, title: "Promotional Offers", desc: "Blast your latest deals, sales, and discount codes to your entire customer base via an engaging voice message." },
      { icon: ShieldCheck, title: "Emergency Alerts", desc: "Quickly notify students, employees, or citizens of urgent updates, weather warnings, or security situations in real-time." },
      { icon: Database, title: "Survey & Feedback", desc: "Combine voice broadcasts with IVR (Press 1) to conduct automated phone surveys and collect instant customer feedback." },
      { icon: CheckCircle2, title: "Event Notifications", desc: "Send automated voice reminders to attendees regarding event timings, webinar links, or venue changes to maximize turnout." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Upload Contacts & Audio", desc: "Upload your customer database (CSV/Excel) and record or upload your voice message (MP3/WAV) to the dashboard." },
      { title: "Schedule the Broadcast", desc: "Choose whether to blast the campaign immediately or schedule it for a specific date and time based on user availability." },
      { title: "Calls are Dispatched", desc: "Our high-capacity cloud servers simultaneously dial the numbers. If picked up, your message is played instantly." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>Bulk Voice Solution?</Hi></>,
    cards: [
      { icon: ListChecks, title: "DND Scrubbing", desc: "Ensure 100% compliance. Our system automatically filters out Do-Not-Disturb (DND) registered numbers before initiating the broadcast." },
      { icon: PhoneCall, title: "Automated Retries", desc: "Maximize reach with auto-retry features. If a call is unanswered or busy, the system will automatically attempt to call back at a later interval." },
      { icon: Languages, title: "Text-to-Speech (TTS)", desc: "Don't have pre-recorded audio? Simply type your message, and our advanced AI will convert your text into natural-sounding voice audio in regional languages." },
      { icon: Maximize, title: "Unmatched Scalability", desc: "Whether sending 500 calls or 500,000 calls, our multi-tenant cloud architecture processes massive volumes simultaneously without lag." },
      { icon: Mic, title: "Interactive Press 1 (IVR)", desc: "Convert one-way broadcasts into two-way communication. Allow users to \"Press 1\" during the message to instantly connect with a live sales agent." },
      { icon: BarChart, title: "Real-Time Analytics", desc: "Track answered calls, failed calls, average listen durations, and key presses via a comprehensive real-time dashboard." },
    ],
  },
  {
    title: <>{"Types of "}<Hi>Voice Campaigns</Hi></>,
    cards: [
      { icon: TrendingUp, title: "Promotional Calls", desc: "Used purely for sales and marketing. Broadcast product launches, discounts, and offers to your opted-in customer base to drive immediate sales." },
      { icon: ShieldCheck, title: "Transactional Calls", desc: "Used for essential notifications like OTP deliveries, order confirmations, and urgent alerts. These can bypass standard DND registries due to their critical nature." },
      { icon: Network, title: "Interactive Broadcasts", desc: "Combine outbound voice calls with DTMF inputs. Play a message and ask the user to respond using their dialpad (e.g., \"Press 1 to renew your subscription\")." },
    ],
  },
  {
    kind: "cta",
    title: "Amplify your reach today.",
    body: [
      "Connect with thousands of prospects in minutes. Sign up now and launch your first bulk voice campaign effortlessly.",
    ],
    button: "Start Broadcasting Now",
  },
];

export default function CloudBulkVoiceCallPage() {
  return <FlexPage sections={SECTIONS} />;
}
