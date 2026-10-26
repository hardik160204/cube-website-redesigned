import React from "react";
import { Car, Clock, Database, EyeOff, FileAudio, Heart, Key, LineChart, LinkIcon, MessageSquare, Network, PhoneCall, Shield, ShoppingBag, Stethoscope, UserX } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "number-masking",
    title: <>{"Secure Cloud "}<Hi>Number Masking</Hi></>,
    body: [
      "Protect the privacy of your customers and agents. Facilitate seamless voice and SMS communication without ever revealing personal phone numbers on either side.",
    ],
    button: "Secure Your Calls",
  },
  {
    title: <>{"Absolute Privacy for "}<Hi>Every Call</Hi></>,
    body: [
      "Number Masking (or Call Anonymization) is a cloud telephony feature that connects two parties on a phone call without revealing either person's actual phone number.",
      "Instead of dialing directly, both parties are connected through a temporary virtual number. This ensures absolute privacy, prevents off-platform transactions, and keeps personal data safe from misuse, making it essential for modern aggregators and marketplaces.",
    ],
    tiles: [{ icon: Shield, label: "Privacy First" }, { icon: EyeOff, label: "Hidden ID" }, { icon: LinkIcon, label: "Secure Bridge" }, { icon: UserX, label: "Anti-Poach" }],
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use Call Masking?"}</>,
    cards: [
      { icon: Car, title: "Ride Hailing & Taxis", desc: "Connect drivers and riders seamlessly. Both can call each other regarding pickups without ever seeing the other person's real mobile number." },
      { icon: ShoppingBag, title: "E-Commerce Delivery", desc: "Allow delivery executives to call customers for location directions while keeping the customer's personal data completely hidden." },
      { icon: Heart, title: "Dating & Matrimony", desc: "Provide a safe environment for users to speak on the phone before meeting in person, without compromising their personal contact info." },
      { icon: UserX, title: "Preventing Poaching", desc: "Ensure your vendors and clients communicate only through your platform, preventing them from bypassing your marketplace for direct deals." },
      { icon: Stethoscope, title: "Telemedicine", desc: "Connect doctors and patients for private health consultations while maintaining strict HIPAA compliance and protecting doctor privacy." },
      { icon: Database, title: "Recruitment & HR", desc: "Allow recruiters to interview candidates via masked numbers, keeping the recruiters' direct lines free from unsolicited callbacks." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "The Call is Triggered", desc: "A user taps 'Call Driver' in your app. Instead of dialing the driver directly, the app initiates a call to a temporary virtual proxy number." },
      { title: "The Server Masks IDs", desc: "Our cloud telephony engine receives the call, hides the caller's real number, and looks up the driver's actual number in your database." },
      { title: "Secure Call Bridging", desc: "The server dials the driver. When the driver looks at their phone, they only see the proxy virtual number, ensuring 100% two-way anonymity." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>Masking API?</Hi></>,
    cards: [
      { icon: Network, title: "Two-Way Masking", desc: "Absolute protection on both sides of the conversation. The caller and the receiver only ever see the proxy virtual number on their caller IDs." },
      { icon: Clock, title: "Time-Bound Expiration", desc: "Sessions can be programmed to expire. Once a food delivery is marked 'Delivered', the virtual number immediately stops connecting the two parties." },
      { icon: FileAudio, title: "Call Recording", desc: "Every masked conversation can be recorded and archived to your servers for quality assurance and rapid dispute resolution." },
      { icon: LineChart, title: "Detailed Analytics", desc: "Track missed calls, average talk time, and connection success rates to ensure your drivers or agents are communicating effectively." },
      { icon: MessageSquare, title: "Omnichannel (Voice & SMS)", desc: "Masking isn't just for calls. Allow users to send SMS texts through the proxy number, protecting privacy across all communication mediums." },
      { icon: Key, title: "Developer Friendly API", desc: "Integrate masking seamlessly into your proprietary mobile app or backend software using our well-documented REST APIs and Webhooks." },
    ],
  },
  {
    title: <>{"Implementation "}<Hi>Methods</Hi></>,
    cards: [
      { icon: PhoneCall, title: "Voice Call Masking", desc: "The standard implementation. A customer and a service provider are bridged via a virtual proxy number to communicate via voice while keeping personal IDs hidden." },
      { icon: MessageSquare, title: "SMS Masking", desc: "Perfect for automated alerts. Delivery executives can text \"I have arrived\" to a proxy number, which forwards the text to the customer without exposing the driver's number." },
      { icon: Clock, title: "Temporary Bridging", desc: "Generate disposable phone numbers that only last for the duration of a transaction (e.g., an active Uber ride). Once the ride is over, the number is recycled." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to secure your platform?",
    body: [
      "Protect your users' privacy, prevent platform leakage, and maintain complete control over your business communications.",
    ],
    button: "Implement Masking API",
  },
];

export default function CloudNumberMaskingPage() {
  return <FlexPage sections={SECTIONS} />;
}
