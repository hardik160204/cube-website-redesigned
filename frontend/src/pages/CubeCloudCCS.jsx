import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight, Users, MessageCircle, BarChart, CheckCircle2, ShieldCheck, Zap, Network, Database, PhoneMissed,
  PhoneForwarded, Megaphone, Bot, Headphones, PhoneCall, Mic, ClipboardList, TrendingDown, TrendingUp, Monitor,
} from "lucide-react";
import Faq from "../components/home/Faq";
import ClosingCta from "../components/home/ClosingCta";
import { CONTACT } from "../components/home/catalog";
import { ACCENTS, CtaButtons, Heading, PageHero, Prose, Reveal, Section, Split, Title, TrustBand } from "../components/page/kit";

// =========================================================================
// PAGE CONTENT DATA
// =========================================================================

// 15 Small Service Cards Data
const CLOUD_SERVICES = [
  { icon: Mic, title: "IVR", desc: "Interactive Voice Response system for automated intelligent routing.", color: "blue", path: "/services/ivr" },
  { icon: PhoneMissed, title: "Missed Call Service", desc: "Engage customers easily with zero-cost missed call campaigns.", color: "blue", path: "/services/missed-call" },
  { icon: PhoneForwarded, title: "Auto Dialer", desc: "Automate outbound calls to maximize your agents' talk time.", color: "blue", path: "/services/auto-dialer" },
  { icon: BarChart, title: "Live Analytics", desc: "Real-time wallboards and detailed historical call reports.", color: "blue", path: "/services/live-analytics" },
  { icon: ClipboardList, title: "Quality Analysis", desc: "Evaluate interactions and monitor agent performance to maintain high service standards.", color: "blue", path: "/services/quality-analysis" },
   { icon: PhoneCall, title: "Virtual Number", desc: "Localize your brand's presence with dedicated virtual numbers.", color: "blue", path: "/services/virtual-number" },
  { icon: Database, title: "Call Recording", desc: "Securely record and monitor business calls for quality assurance.", color: "blue", path: "/services/call-recording" },
  { icon: Zap, title: "Click to Call", desc: "Enable instant calling directly from your website or mobile app.", color: "blue", path: "/services/click-to-call" },
  { icon: Network, title: "Smart Call Routing", desc: "Intelligent skill-based and time-based agent call routing.", color: "blue", path: "/services/smart-call-routing" },
  { icon: ShieldCheck, title: "Number Masking", desc: "Protect customer and agent privacy with secure number masking.", color: "blue", path: "/services/number-masking" },
  { icon: Megaphone, title: "Bulk Voice Calls", desc: "Broadcast voice messages to thousands of customers instantly.", color: "blue", path: "/services/bulk-voice-call" },
  { icon: MessageCircle, title: "Whatsapp Chat Bot", desc: "Automate customer support and notifications on WhatsApp 24/7.", color: "blue", path: "/services/whatsapp-bot" },
  { icon: Bot, title: "Web Chat Bot", desc: "AI-powered web widget for instant visitor engagement and help.", color: "blue", path: "/services/web-chat-bot" },
  { icon: Users, title: "CRM Integration", desc: "Manage leads and customer interactions seamlessly in one place.", color: "blue", path: "/services/crm-integration" },
  { icon: Headphones, title: "Toll Free Number", desc: "Provide a free, professional contact method for your customers.", color: "blue", path: "/services/toll-free-number" }
];

const BENEFITS_DATA = [
  { title: "AI-Powered Cloud Telephony", desc: "AI-Powered Cloud Telephony for Smarter Customer Conversations" },
  { title: "Seamless CRM Integrations", desc: "Connect your CRM and business applications with powerful cloud communication capabilities." },
  { title: "Customized Solution", desc: "Flexible, customized solutions designed around your requirements and deployed quickly." },
  { title: "Work From Anywhere", desc: " Agents can log in and securely handle customer calls from the office, home, or anywhere." }
];

// USP Section Data
const USP_DATA = [
  {
    title: "IVR Service",
    icon: Mic,
    bullets: [
      "AI Integration",
      "Google, Amazon, IBM AI Integration",
      "Agent can see customer number on incoming call",
      "CRM/Third Part Integration",
      "Quick Customization Possible",
      "Chat Bot Integration",
      "Free Lead Management System",
      "Marketing Automation Integration"
    ]
  },
  {
    title: "Bulk Voice Calls",
    icon: Megaphone,
    bullets: [
      "Custom Reserved Caller ID",
      "Call Back Feature",
      "Wait till noise feature",
      "On Extension Lead",
      "On Answer SMS",
      "On Extension SMS",
      "2 Way (Incoming & Outgoing)"
    ]
  },
  {
    title: "Chat Bot",
    icon: Bot,
    bullets: [
      "Whatsapp and Web Support",
      "Super Easy to create and operate",
      "AI and Scripted bots",
      "Manual Agent Transfer Support",
      "Whatsapp Sharing between multiple Agents",
      "Internal Team communication inside chat",
      "Automatic Sales Agent Whatsapp Tracking",
      "Multi-Media support",
      "API Support"
    ]
  },
  {
    title: "Auto Dialer",
    icon: PhoneForwarded,
    bullets: [
      "App Based Dialler so no OTC",
      "Highly Scalable",
      "Inbound and Outbound call tracking",
      "Two Way Call Masking",
      "Configure call back on masked number",
      "Multiple policy assignment",
      "CRM Integrations"
    ]
  }
];

// FACTS Section Data
const FACTS_DATA = [
  {
    icon: TrendingDown,
    stat: "75%",
    title: "Reduced Cost",
    desc: "More than 75% of Enterprises that adopt cloud telephony, accept that it reduces IT cost"
  },
  {
    icon: TrendingUp,
    stat: "95%",
    title: "High Availability",
    desc: "95% of businesses report that service availability improved since moving to the cloud"
  },
  {
    icon: Monitor,
    stat: "92%",
    title: "High Scalability",
    desc: "Enables operations more efficient - accelerating growth. In other words, it readily provides safety to your systems - even if your load increases."
  }
];

const FAQ_DATA = [
  { q: "Do I need physical servers to use the Cloud Contact Center?", a: "No, absolutely not! Cube Cloud Contact Center is 100% cloud-hosted. All you need is a computer, a headset, and an active internet connection to start making and receiving calls." },
  { q: "Can I keep my existing business phone numbers?", a: "Yes. We provide seamless number porting. You can bring your existing toll-free, local, or mobile numbers to our platform with zero downtime." },
  { q: "How long does it take to set up?", a: "Standard setups are incredibly fast. We can typically deploy your cloud contact center, configure your IVR, and train your agents within 24 to 48 hours." },
  { q: "Is the platform secure and compliant?", a: "Yes. Our infrastructure follows strict data protection guidelines. Call recordings and customer data are encrypted, ensuring compliance with major industry standards." },
  { q: "Can my agents work remotely?", a: "Yes, our solution is designed for hybrid and remote work. Agents can log in via their web browser from anywhere in the world while supervisors monitor them in real-time." }
];


export default function CubeCloudCCS() {
  return (
    <>
      <PageHero
        crumbs={["Services", "Cloud Contact Center"]}
        label="Cloud Contact Center"
        title="Transform Customer Experience"
        highlight="with an All-in-One Cloud Solution"
        body="Accelerate your team collaboration with powerful cloud dialing, comprehensive features, and SIP trunking solutions — engineered for high-performance enterprises."
        video="/cube-main2.mp4"
        stats={[
          { value: "35+", label: "Years of Innovation" },
          { value: "10+", label: "Countries" },
          { value: "5000+", label: "Active Users" },
          { value: "99.9%", label: "Uptime Guarantee" },
        ]}
        actions={<CtaButtons primary="Book Demo" secondary="Talk to Sales" phone={CONTACT.sales} dark />}
      />

      <TrustBand />

      <Section tone="tint">
        <Split image="/ccsmain.jpeg" imageAlt="Cloud Call Center Analytics" reverse>
          <Title>Why Choose Cube Cloud Telephony?</Title>
          <Prose
            className="mt-6"
            paragraphs={[
              "Experience. Ownership. Flexibility. Innovation., Best In Class Quality High-efficiency infrastructure with robust quality controls for reliable 24×7 operations.",
              "End-to-End Communication Platform — From voice infrastructure and dialers to CRM, AI, analytics, WhatsApp/social channels and integrations, customers can build their communication ecosystem with one technology partner.",
            ]}
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {BENEFITS_DATA.map((b, i) => (
              <Reveal as="li" key={b.title} delay={i * 0.06} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D9F3FF] text-[#0047FF]">
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <h3 className="font-medium text-[#0A0626]">{b.title}</h3>
                  <p className="mt-1 text-[14px] leading-6 text-[#4A4D53]">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Split>
      </Section>

      <Section>
        <Heading title="Cloud Contact Center" highlight="Services" body="We provide an end-to-end solution to our users." align="center" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CLOUD_SERVICES.map((s, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Reveal as="li" key={s.title} delay={(i % 5) * 0.06} className="h-full">
                <Link
                  to={s.path}
                  className="group flex h-full flex-col rounded-[22px] border border-[#E5EAF4] bg-white p-6 transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:border-[#99B5FF] hover:shadow-[0_24px_48px_-28px_rgb(0_71_255/0.5)] hover:[translate:0_-4px]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition-transform duration-300 ease-out-expo group-hover:[transform:rotate(-6deg)_scale(1.06)]" style={{ background: accent, boxShadow: `0 10px 20px -8px ${accent}` }}>
                    <s.icon size={20} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-medium leading-snug text-[#0A0626] transition-colors group-hover:text-primary">{s.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-6 text-[#4A4D53]">{s.desc}</p>
                  <span className="mt-auto flex items-center gap-1 pt-5 text-[13px] font-medium text-primary">
                    View More <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      <Section tone="dark">
        <Heading title="Our" highlight="USP" body="Here are few smart features" align="center" dark />
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {USP_DATA.map((u, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Reveal as="li" key={u.title} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-[24px] border border-white/10 bg-white/[0.04] p-7 transition-[border-color,translate] duration-300 ease-out-expo hover:border-[#00B8FF]/40 hover:[translate:0_-4px]">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: accent, boxShadow: `0 10px 20px -8px ${accent}` }}>
                      <u.icon size={20} />
                    </span>
                    <h3 className="text-xl font-medium text-white">{u.title}</h3>
                  </div>
                  <ul className="mt-5 flex flex-col gap-3">
                    {u.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[14.5px] leading-6 text-[#C9D2EC]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 rounded-[1px] bg-[#00B8FF]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      <Section tone="tint">
        <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(110deg,#2300DC_0%,#0047FF_55%,#0091FF_100%)] p-8 sm:p-12 lg:p-16">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-white/10 blur-[100px]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white">Business Security</span>
              <h2 className="mt-5 text-[32px] font-medium leading-[1.12] text-white md:text-[44px]">Enhance Your Operations</h2>
              <p className="mt-5 text-[16px] leading-7 text-[#DCE6FF]">
                94% of Managers state their business security and workflow efficiency have drastically improved after migrating to robust <strong className="font-semibold text-white">cloud telephony services.</strong>
              </p>
            </Reveal>
            <ul className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
              {FACTS_DATA.map((f, i) => (
                <Reveal as="li" key={f.title} delay={0.1 + i * 0.1} className="h-full">
                  <div className="flex h-full flex-col rounded-[24px] bg-white p-6 shadow-[0_30px_60px_-30px_rgb(10_6_38/0.6)] transition-[translate] duration-300 ease-out-expo hover:[translate:0_-4px]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6EEFF] text-primary">
                      <f.icon size={22} />
                    </span>
                    <p className="mt-4 bg-gradient-to-r from-[#0047FF] to-[#2300DC] bg-clip-text text-[44px] font-medium leading-none text-transparent">{f.stat}</p>
                    <h3 className="mt-4 font-medium text-[#0A0626]">{f.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-6 text-[#4A4D53]">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Faq items={FAQ_DATA} label="Knowledge Base" title="Frequently Asked" highlight="Questions" />

      <ClosingCta
        label="To All Your Customers"
        title="Ready to Upgrade Your Support Center?"
        body="Connect with our experts today. We will assess your call volume and set up a customized cloud environment for your team. Give your brand a better outlook by using professional cloud services."
        primary="Book a Free Demo"
      >
        <ul className="mt-7 flex max-w-[640px] flex-wrap justify-center gap-2">
          {["Unlimited Channels", "Multi level IVR", "Unlimited Users", "API integration", "Real Time Notification"].map((t) => (
            <li key={t} className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[13px] text-white">
              {t}
            </li>
          ))}
        </ul>
      </ClosingCta>
    </>
  );
}
