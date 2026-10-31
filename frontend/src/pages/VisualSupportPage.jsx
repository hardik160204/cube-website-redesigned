import React from "react";
import { Link } from "react-router-dom";
import {
  CircleCheck, Eye, EyeOff, FileText, Globe, Hand, Headset, Layers, Lock, MousePointerClick, Phone, ScreenShare, ShieldCheck, UserCheck, Wifi, Workflow, X, Zap,
} from "lucide-react";
import { CheckList, FeatureCards, Heading, LinkPair, PageHero, Prose, Reveal, Section, Steps, Tiles, Title, Label } from "../components/page/kit";
import { useList } from "../lib/editable";
import Faq from "../components/home/Faq";
import Products from "../components/home/Products";
import { CONTACT, tel } from "../components/home/catalog";

// Co-Browsing and Screen Sharing: real-time visual support. Copy is Cube's own brief for these pages. Each
// page leads with its own feature, then shares the comparison, privacy, getting-started and FAQ sections.

const FEATURES = {
  "co-browsing": {
    title: "Co-Browsing",
    image: "/products/co-browsing.svg",
    tagline: "See it together. Solve it faster. Share only this website with an agent — your sensitive data stays hidden.",
    whatTitle: "What is Co-Browsing?",
    what: [
      "Co-Browsing lets you and one of our agents look at the same page of our website together. Your agent sees exactly what appears on your screen within our site, can point to buttons, highlight sections, and, with your permission, help you complete forms.",
      "Unlike a video stream, Co-Browsing shares only the pages of our website. Nothing else on your computer is visible.",
    ],
    steps: [
      { title: "Start a session", desc: "Click the “Co-Browse” button or give your agent the short session code they provide." },
      { title: "Give consent", desc: "A clear prompt asks for your permission before anything is shared." },
      { title: "Get guided", desc: "Your agent can see your page, highlight items, draw attention to the right option, and walk you through each step." },
      { title: "End anytime", desc: "Click “End session” and sharing stops immediately." },
    ],
    benefits: [
      { icon: Lock, title: "Private by design", desc: "Only our website pages are shared. Your other tabs, applications, notifications, and personal files are never visible." },
      { icon: EyeOff, title: "Sensitive data stays hidden", desc: "Passwords, card numbers, ID numbers, and other sensitive fields are automatically masked, so agents never see them." },
      { icon: Zap, title: "Faster resolution", desc: "Agents see the issue immediately instead of relying on descriptions, which means fewer back-and-forth messages." },
      { icon: MousePointerClick, title: "Guided assistance", desc: "Agents can highlight buttons, scroll the page for you, and help fill in non-sensitive fields." },
      { icon: Wifi, title: "Lightweight and fast", desc: "Works smoothly even on slower connections, since it does not stream video." },
      { icon: Globe, title: "No installation", desc: "Nothing to download. It runs in your browser." },
    ],
    can: [
      "View your page: see the same website page you are viewing",
      "Point and highlight: draw your attention to the right button, link, or section",
      "Annotate: mark up the page with arrows or drawings",
      "Scroll and navigate: move you to the right place on the page (with permission)",
      "Assist with forms: fill in non-sensitive fields on your behalf (with permission)",
    ],
    cannot: ["See anything outside our website", "See masked fields such as passwords and payment details", "Continue the session after you end it", "Take actions you have not approved"],
    ideal: [
      "Completing long or complex forms and applications",
      "Account setup and onboarding",
      "Navigating product or service selection",
      "Checkout and payment assistance",
      "Finding settings, documents, or information on the site",
    ],
  },
  "screen-sharing": {
    title: "Screen Sharing",
    image: "/products/screen-sharing.svg",
    tagline: "Show an agent your screen, window, or tab — you choose what is shared, and you can stop at any moment.",
    whatTitle: "What is Screen Sharing?",
    what: [
      "Screen Sharing lets you show your agent your entire screen, a single application window, or one browser tab. It is the right choice when your question goes beyond our website, for example, a problem with another application, a file on your desktop, or a step that involves several programs.",
    ],
    steps: [
      { title: "Request or accept an invitation", desc: "Click “Share my screen” or accept the invitation from your agent." },
      { title: "Choose what to share", desc: "Your browser asks whether to share your entire screen, one window, or one tab. You decide." },
      { title: "Show and talk", desc: "Your agent sees your selection live and can talk you through the solution by chat or voice." },
      { title: "Stop sharing", desc: "Click “Stop sharing” in the browser bar or on our site at any time." },
    ],
    benefits: [
      { icon: Layers, title: "Works beyond our website", desc: "Share any app, window, or tab, not only our pages." },
      { icon: Eye, title: "You control what is visible", desc: "Pick a single window or tab to keep everything else private." },
      { icon: ScreenShare, title: "Visible sharing indicator", desc: "Your browser clearly shows when sharing is active." },
      { icon: Workflow, title: "Great for complex troubleshooting", desc: "Agents can observe the exact steps you take and spot where things go wrong." },
      { icon: Headset, title: "Voice and chat friendly", desc: "Combine sharing with a call or live chat for natural, real-time guidance." },
    ],
    can: [
      "View the screen, window, or tab you choose to share",
      "Follow along as you perform steps",
      "Guide you by chat or voice",
      "Record the session for quality or training purposes, only where disclosed and consented to",
    ],
    cannot: ["Control your computer, unless you explicitly grant remote control", "See anything you have not chosen to share", "Continue viewing after you stop sharing"],
    ideal: [
      "Technical troubleshooting across different applications",
      "Software installation and configuration help",
      "Demonstrations and product walkthroughs",
      "Training sessions and onboarding calls",
      "Issues that involve files or settings on your own device",
    ],
  },
};

const COMPARE = [
  ["What is shared", "Our website pages only", "Screen, window, or tab you choose"],
  ["Privacy level", "Highest. Limited to our site, sensitive fields masked", "Depends on what you select to share"],
  ["Agent guidance", "Highlight, annotate, assist with forms", "View and guide by voice or chat"],
  ["Best for", "Website tasks, forms, checkout", "Cross-application or device issues"],
  ["Connection needs", "Low bandwidth", "Moderate bandwidth"],
  ["Setup", "One click, no install", "One click, browser permission prompt"],
];

const PRIVACY = [
  { icon: CircleCheck, title: "Consent every time", desc: "Nothing is shared without your clear approval." },
  { icon: Hand, title: "You are always in control", desc: "End any session instantly with one click." },
  { icon: Lock, title: "Encrypted connections", desc: "All session data is transmitted over secure, encrypted channels." },
  { icon: EyeOff, title: "Sensitive data protection", desc: "Passwords, payment details, and similar fields are masked and never shown to agents." },
  { icon: UserCheck, title: "Verified agents", desc: "Only authenticated team members can join sessions." },
  { icon: FileText, title: "Transparent records", desc: "Sessions are logged for security and quality. Recordings, if any, are disclosed in advance and handled according to our Privacy Policy." },
  { icon: ShieldCheck, title: "Compliance minded", desc: "Our practices align with applicable data protection regulations." },
];

const GETTING_STARTED = [
  { title: "Open our website", desc: "Look for the Help / Live Support button." },
  { title: "Choose your option", desc: "Start Co-Browsing or Share My Screen." },
  { title: "Approve the consent prompt", desc: "Nothing is shared until you say yes." },
  { title: "Follow along", desc: "Your agent guides you step by step." },
];

const REQUIREMENTS = [
  "A current version of Chrome, Edge, Firefox, or Safari (screen sharing support may vary on some mobile browsers)",
  "A stable internet connection",
  "Cookies and JavaScript enabled",
];

const FAQS = [
  { q: "Do I need to install anything?", a: "No. Both features run directly in your browser." },
  { q: "Can the agent see my passwords or card details?", a: "No. Sensitive fields are masked in Co-Browsing, and in Screen Sharing you choose exactly what is visible, so you can close anything private before sharing." },
  { q: "Can the agent control my computer?", a: "Not by default. Agents can only guide you. Any form assistance or remote control requires your explicit permission." },
  { q: "How do I stop a session?", a: "Click “End session” (Co-Browsing) or “Stop sharing” (Screen Sharing) at any time. Sharing ends immediately." },
  { q: "Is there a cost?", a: "These features are provided as part of our support service." },
  { q: "Does it work on mobile?", a: "Co-Browsing works on most modern mobile browsers. Screen Sharing support depends on your device and browser." },
  { q: "Are sessions recorded?", a: "Only where disclosed and agreed to in advance. See our Privacy Policy for details." },
];

// "What your agent cannot do": the CheckList's look with a cross instead of a tick.
function NoList({ items: builtIn }) {
  const { items, mark } = useList("checklist", builtIn);
  return (
    <ul {...mark} className="mt-8 grid gap-3.5">
      {items.map((b, i) => (
        <Reveal as="li" key={`${i}-${b}`} delay={Math.min(i, 6) * 0.05} className="flex items-start gap-3 text-[16px] leading-7 text-[#31343A]">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[#C81E1E]">
            <X size={14} strokeWidth={3} />
          </span>
          <span>{b}</span>
        </Reveal>
      ))}
    </ul>
  );
}

function Compare({ current }) {
  const col = (k) => (k === current ? "bg-[#EEF3FF] text-[#0A0626]" : "text-[#404348]");
  return (
    <Reveal className="mt-12 overflow-x-auto rounded-[24px] border border-[#E5EAF4] bg-white">
      <table className="w-full min-w-[640px] text-left text-[15px]">
        <thead>
          <tr className="border-b border-[#E5EAF4]">
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#6B6E75]">
              <span className="sr-only">Compared on</span>
            </th>
            {[
              ["co-browsing", "Co-Browsing"],
              ["screen-sharing", "Screen Sharing"],
            ].map(([k, label]) => (
              <th key={k} className={`px-6 py-4 text-lg font-medium ${col(k)}`}>
                <Link to={`/services/${k}`} className="hover:text-primary">
                  {label}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEF1F7]">
          {COMPARE.map(([aspect, co, ss]) => (
            <tr key={aspect}>
              <th scope="row" className="px-6 py-4 font-medium text-[#0A0626]">
                {aspect}
              </th>
              <td className={`px-6 py-4 ${col("co-browsing")}`}>{co}</td>
              <td className={`px-6 py-4 ${col("screen-sharing")}`}>{ss}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  );
}

// The three call-to-action buttons from the brief. Sessions are started with the support team, so the two
// session buttons lead to Contact; the third calls an expert.
function SupportButtons({ dark = false, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <LinkPair primary={{ label: "Start Co-Browsing", to: "/contact" }} secondary={{ label: "Share My Screen", to: "/contact" }} dark={dark} />
      <a
        href={tel(CONTACT.expert)}
        className={`inline-flex h-12 items-center gap-2 rounded-lg px-4 font-medium transition-colors ${dark ? "text-white hover:bg-white/10" : "text-[#0A0626] hover:bg-[#F0F4FB]"}`}
      >
        <Phone size={16} /> Contact Support
      </a>
    </div>
  );
}

export default function VisualSupportPage({ feature }) {
  const f = FEATURES[feature];
  const other = feature === "co-browsing" ? "screen-sharing" : "co-browsing";
  return (
    <>
      <PageHero
        crumbs={["Products", f.title]}
        label="Visual support"
        title={`${f.title}:`}
        highlight="See It, Share It, Solve It"
        body={f.tagline}
        image={f.image}
        imageAlt={`${f.title} illustration`}
        actions={<SupportButtons dark />}
      />

      <Section tone="tint">
        <div className="mx-auto max-w-[860px] text-center">
          <Heading label="Overview" title="Real-time visual support built right into our website." align="center" />
          <Prose
            className="mt-6 text-left"
            paragraphs={[
              "No downloads, no confusion, just faster answers. Sometimes a phone call or chat is not enough. Explaining where to click, which field to fill, or what an error message says can take far longer than simply showing it. Our Co-Browsing and Screen Sharing features let our team see what you see and guide you step by step, in real time, directly from your browser.",
              "Both features start with your consent, work on any modern browser, and can be ended by you at any moment.",
            ]}
          />
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-[860px]">
          <Label>{f.title}</Label>
          <Title>{f.whatTitle}</Title>
          <Prose paragraphs={f.what} className="mt-6" />
        </div>
      </Section>

      <Section tone="dark">
        <Heading label="How it works" title={`${f.title} in four steps`} align="center" dark />
        <Steps items={f.steps} dark className="mt-14" />
      </Section>

      <Section>
        <Heading label="Key benefits" title={`Why use ${f.title}`} align="center" />
        <FeatureCards items={f.benefits} cols={3} className="mt-12" />
      </Section>

      <Section tone="tint">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <Label>What your agent can do</Label>
            <Title>Guidance, with your permission</Title>
            <CheckList items={f.can} className="mt-8" />
          </div>
          <div>
            <Label>What your agent cannot do</Label>
            <Title>Your limits, always</Title>
            <NoList items={f.cannot} />
          </div>
        </div>
      </Section>

      <Section>
        <Heading label="Ideal for" title={`When ${f.title} helps most`} align="center" />
        <Tiles items={f.ideal} cols={3} className="mt-12" />
      </Section>

      <Section tone="tint">
        <Heading label="Co-Browsing vs. Screen Sharing" title="Which one do I need?" align="center" />
        <Compare current={feature} />
        <p className="mx-auto mt-8 max-w-[720px] text-center text-[16px] leading-7 text-[#404348]">
          Not sure which to use? Start with Co-Browsing. If your agent needs to see something outside our website, they can invite you to switch to Screen Sharing.{" "}
          <Link to={`/services/${other}`} className="font-medium text-primary hover:underline">
            Read about {FEATURES[other].title} →
          </Link>
        </p>
      </Section>

      <Section tone="dark">
        <Heading label="Your privacy and security" title="Your trust matters. Both features are designed with privacy first." align="center" dark />
        <FeatureCards items={PRIVACY} cols={4} dark className="mt-12" />
      </Section>

      <Section>
        <Heading label="Getting started" title="Four steps to visual support" align="center" />
        <Steps items={GETTING_STARTED} className="mt-14" />
        <div className="mx-auto mt-16 max-w-[760px]">
          <Label>System requirements</Label>
          <CheckList items={REQUIREMENTS} className="mt-6" />
        </div>
      </Section>

      <div className="bg-[#F0F4FB]">
        <Faq items={FAQS} label="FAQ" title="Frequently asked" highlight="questions" id="faq" />
      </div>

      <Section tone="dark">
        <div className="mx-auto max-w-[760px] text-center">
          <Label dark>Need a hand?</Label>
          <h2 className="mt-3 text-[30px] font-medium leading-[1.15] text-white md:text-[44px]">Show us, and we will guide you.</h2>
          <p className="mt-4 text-[17px] leading-7 text-[#C9D2EC]">Live, secure visual support, right in your browser.</p>
          <SupportButtons dark className="mt-9 justify-center" />
        </div>
      </Section>

      <Products />
    </>
  );
}
