import React from "react";
import {
  Radio, UserCog, CalendarClock, Disc, Bell, Plug, ShieldCheck, Headphones, BrainCircuit,
} from "lucide-react";
import ProductPage from "../components/page/ProductPage";

// =========================================================================
// CONFERENCE BRIDGE SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Conference Bridge",
  tagline: "Full-featured audio conferencing that connects smoothly with cloud services or your existing phone system",
  heroVideo: "/conference-bridge-bg.mp4", // <-- UPDATE THIS TO YOUR EXACT VIDEO FILE NAME IN THE PUBLIC FOLDER
  stats: [
    { value: "100s", label: "Participants" },
    { value: "PIN", label: "Secured Rooms" },
    { value: "Rec", label: "Every Session" },
  ],
  overview: [
    "Cube Conference Bridge provides full audio conferencing as a software component that integrates with your PBX or SIP infrastructure. Host scheduled or ad-hoc conferences with hundreds of participants dialing in from anywhere — no per-minute fees to third-party services.",
    "Moderator controls, entry announcements, mute-all, lecture mode and automatic recording make it ideal for board meetings, investor calls, training sessions and daily stand-ups across branches.",
  ],
  features: [
    { icon: Radio, title: "Unlimited Rooms", description: "Run many simultaneous conferences with individual PINs." },
    { icon: UserCog, title: "Moderator Controls", description: "Mute, eject, lock room, lecture mode and roll call." },
    { icon: CalendarClock, title: "Scheduled & Ad-hoc", description: "Book recurring calls or spin up a bridge instantly." },
    { icon: Disc, title: "Auto Recording", description: "Every conference archived and shareable in one click." },
    { icon: Bell, title: "Entry/Exit Tones", description: "Name announcements and participant count on join." },
    { icon: Plug, title: "PBX/SIP Integration", description: "Slots into your existing Cube PBX or third-party system." },
  ],
  benefits: [
    "Eliminate recurring third-party conferencing fees",
    "Keep sensitive calls on your own infrastructure",
    "Join from any phone — no apps required",
    "Archive every meeting automatically",
    "Scales to hundreds of concurrent participants",
    "Works with existing DID numbers",
  ],
  useCases: ["Board & investor calls", "Multi-branch stand-ups", "Training webinars (audio)", "Crisis coordination lines"],
  faqs: [
    { q: "What is Cube Conference Bridge?", a: "It is a full-featured audio conferencing software component that integrates with your existing PBX or SIP infrastructure, allowing you to host multi-party calls securely." },
    { q: "Do participants need to download an app to join?", a: "No, participants can simply dial in using their standard phone or mobile device, eliminating the need for third-party apps or software downloads." },
    { q: "Is there a limit to the number of participants?", a: "Our platform is highly scalable and can comfortably support hundreds of concurrent participants across multiple secure rooms." },
    { q: "Can I record the conference calls?", a: "Yes, the system features automatic recording capabilities, ensuring every conference session is archived securely and is easily shareable." },
    { q: "What moderator controls are available?", a: "Moderators have full control over the room, including the ability to mute all, eject participants, lock the room, initiate lecture mode, and conduct roll calls." },
    { q: "Are there any recurring per-minute fees?", a: "No. Because the bridge operates on your own infrastructure (or as a hosted service by Cube), you eliminate the costly per-minute fees typically charged by third-party conferencing providers." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Enterprise Security", description: "Encrypted protocols, fraud monitoring and hardened infrastructure that protect every conversation your teams have." },
  { icon: Plug, title: "PBX Integration", description: "Plug into your existing infrastructure seamlessly through clean, well-documented protocols." },
  { icon: Headphones, title: "24/7 Support", description: "Never skip a beat. Secure 24/7 dedicated support for your critical business communications." },
  { icon: BrainCircuit, title: "Smart Call Management", description: "Elevate your team with smart routing, clear audio quality, and automated controls." },
];

export default function ConferenceBridge() {
  return <ProductPage data={PAGE_DATA} enterprise={ENTERPRISE_FEATURES} highlight={PAGE_DATA.title} overviewImage="/products/conference-bridge.jpg" />;
}
