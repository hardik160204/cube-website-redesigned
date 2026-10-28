import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Briefcase, Award, Zap, MessageSquare, Globe, Coffee } from "lucide-react";
import { DIAMONDS } from "../components/home/cube-diamonds";
import { ACCENTS, FeatureCards, Heading, LinkPair, PageHero, Reveal, Section } from "../components/page/kit";
import { useSiteData } from "../lib/site";

// Placeholder for the office team hero background
const TEAM_HERO_IMAGE = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80";

const VALUES = [
  { icon: Zap, title: "Innovation First", desc: "We don't just follow industry trends; we build the features that define the future of cloud communication." },
  { icon: Globe, title: "Customer Centric", desc: "Every line of code we write and every server we deploy is designed to make our customers' lives easier and their businesses more profitable." },
  { icon: Award, title: "Uncompromising Quality", desc: "We believe in 99.99% uptime, crystal clear audio, and delivering a premium enterprise experience to businesses of all sizes." },
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200", alt: "Team Collaboration", caption: "Annual Strategy Meetup", span: "md:col-span-2 md:row-span-2" },
  { src: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600", alt: "Office Function", caption: "Diwali Celebrations" },
  { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600", alt: "Team Lunch", caption: "Team Success Lunch" },
  { src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=600", alt: "Awards Night", caption: "Annual Awards Night" },
  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200", alt: "Corporate Event", caption: "Tech Conference 2024", span: "md:col-span-2" },
];

const DEPARTMENTS = [
  { icon: Zap, title: "Engineering", desc: "Building scalable, secure infrastructure and pushing product features." },
  { icon: MessageSquare, title: "Customer Success", desc: "Ensuring smooth onboarding and providing 24/7 technical support." },
  { icon: Globe, title: "Sales & Marketing", desc: "Expanding our reach and building relationships with global enterprises." },
  { icon: Briefcase, title: "Operations & HR", desc: "Keeping the workplace thriving and organizing our legendary office functions." },
];

const LinkedIn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

// A leader's card: portrait in a gradient frame; on hover (or keyboard focus) the bio rises over it.
// Every card carries a LinkedIn button. Open slots show the Cube mark until a photo is added.
function LeaderCard({ m, i }) {
  const linked = /^https:\/\//.test(m.linkedin || "");
  return (
    <Reveal as="li" delay={(i % 3) * 0.08}>
      <article tabIndex={0} className="group relative h-full rounded-[30px] bg-[linear-gradient(135deg,#00B8FF,#0047FF_50%,#2300DC)] p-[1.5px] outline-none transition-[box-shadow,translate] duration-300 ease-out-expo hover:shadow-[0_40px_70px_-35px_rgb(0_71_255/0.7)] hover:[translate:0_-6px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
        <div className="flex h-full flex-col overflow-hidden rounded-[28.5px] bg-white">
          <div className="relative aspect-[4/4.2] overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#1E3BFF,#0A0626_75%)]">
            {m.image ? (
              <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover object-top transition-[scale] duration-700 ease-out-expo group-hover:[scale:1.06]" />
            ) : (
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 block h-[84px] w-[120px] -translate-x-1/2 -translate-y-1/2">
                {DIAMONDS.map((dm) => (
                  <span key={`${dm.u},${dm.v}`} className="cl-glint absolute h-[16px] w-[16px] rotate-45 rounded-[4px]" style={{ left: 52 + dm.u * 15, top: 4 + dm.v * 15, background: dm.color, boxShadow: `0 0 14px ${dm.color}`, animationDelay: `${dm.v * 0.14}s` }} />
                ))}
              </span>
            )}
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-mono text-[11px] font-semibold text-primary backdrop-blur">{String(i + 1).padStart(2, "0")}</span>
            {m.bio && (
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0A0626] via-[#0A0626]/85 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                <p className="translate-y-3 text-sm leading-6 text-[#DCE3F5] transition-transform duration-300 ease-out-expo group-hover:translate-y-0 group-focus-within:translate-y-0">{m.bio}</p>
              </div>
            )}
          </div>
          <div className="flex flex-1 items-center justify-between gap-3 p-5">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-medium text-[#0A0626]">{m.name}</h3>
              <p className="truncate text-sm text-primary">{m.role}</p>
            </div>
            {linked ? (
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${m.name} on LinkedIn`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F1FB] text-[#0A66C2] transition-[background-color,color,transform] duration-200 hover:scale-110 hover:bg-[#0A66C2] hover:text-white"
              >
                <LinkedIn />
              </a>
            ) : (
              // No profile URL yet: show the badge without a link that goes nowhere.
              <span title="LinkedIn profile coming soon" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0F4FB] text-[#0A66C2]/50">
                <LinkedIn />
              </span>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function MeetOurTeamPage() {
  const { team } = useSiteData();
  return (
    <>
      <PageHero
        crumbs={["Meet Our Team"]}
        label="Meet Our Team"
        title="The Minds Behind"
        highlight="Smart Cloud Telephony"
        body="We are a collective of engineers, innovators, and customer success champions dedicated to revolutionizing how businesses communicate globally."
        backdrop={TEAM_HERO_IMAGE}
        actions={<LinkPair primary={{ label: "Career", to: "/career" }} />}
      />

      <Section>
        <Heading title="Our Core" highlight="Values" align="center" />
        <FeatureCards items={VALUES} className="mt-12" />
      </Section>

      <Section tone="tint">
        <Heading title="Meet Our" highlight="Leadership" body="Guiding our vision with decades of combined experience in telecommunications, software engineering, and enterprise strategy." align="center" />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <LeaderCard key={`${m.name}-${i}`} m={m} i={i} />
          ))}
        </ul>
      </Section>

      <Section>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Heading
            title="Life at"
            highlight="Cube Software"
            body="We work hard, but we celebrate harder. From annual retreats to festive office functions, our culture is built on collaboration, creativity, and community."
          />
          <span className="flex shrink-0 items-center gap-2 self-start rounded-full bg-[#E6EEFF] px-4 py-2 font-medium text-primary md:self-auto">
            <Camera size={18} /> Inside Our World
          </span>
        </div>
        <ul className="mt-12 grid auto-rows-[250px] grid-cols-1 gap-4 md:grid-cols-3">
          {GALLERY.map((g, i) => (
            <Reveal as="li" key={g.caption} delay={i * 0.06} className={`group relative overflow-hidden rounded-[24px] ${g.span || ""}`}>
              <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition-[scale] duration-700 ease-out-expo group-hover:[scale:1.05]" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0A0626]/80 via-transparent to-transparent p-6">
                <p className="text-lg font-medium text-white">{g.caption}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* The departments: four lit panels on the dark ink, each with its number, a glowing icon and a bar that fills on hover */}
      <Section tone="dark">
        <Heading label="How we work" title="The Engines of" highlight="Our Growth" align="center" dark />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEPARTMENTS.map((d, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Reveal as="li" key={d.title} delay={i * 0.08} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-7 transition-[translate,border-color,background-color] duration-300 ease-out-expo hover:border-white/25 hover:bg-white/[0.07] hover:[translate:0_-6px]">
                  <span aria-hidden="true" className="absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60" style={{ background: accent }} />
                  <div className="relative flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-transform duration-300 ease-out-expo group-hover:[transform:rotate(-8deg)_scale(1.08)]" style={{ background: accent, boxShadow: `0 0 0 6px rgb(255 255 255 / 0.04), 0 16px 30px -10px ${accent}` }}>
                      <d.icon size={24} />
                    </span>
                    <span className="font-mono text-[40px] font-semibold leading-none text-white/10 transition-colors duration-300 group-hover:text-white/25">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="relative mt-8 text-xl font-medium text-white">{d.title}</h3>
                  <p className="relative mt-2.5 flex-1 text-[15px] leading-6 text-[#A9B3CC]">{d.desc}</p>
                  <span aria-hidden="true" className="relative mt-7 block h-[3px] w-full origin-left scale-x-[0.18] rounded-full transition-transform duration-500 ease-out-expo group-hover:scale-x-100" style={{ background: accent }} />
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* Careers invitation: a rounded logo-blue panel with the Cube mark glinting beside the line */}
      <section className="bg-white px-4 py-16 md:py-20">
        <Reveal className="relative isolate mx-auto grid max-w-[1100px] items-center gap-10 overflow-hidden rounded-[32px] bg-[linear-gradient(110deg,#2300DC_0%,#0047FF_55%,#0091FF_100%)] px-7 py-12 shadow-[0_40px_80px_-40px_rgb(35_0_220/0.7)] md:grid-cols-[1fr_auto] md:px-14 md:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-white/10 blur-[90px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 -z-10 h-72 w-72 rounded-full bg-[#00B8FF]/30 blur-[90px]" />
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white">
              <Coffee size={14} /> Careers
            </span>
            <h2 className="mt-5 text-[30px] font-medium leading-[1.15] text-white md:text-[42px]">Want to build the future with us?</h2>
            <p className="mt-4 max-w-[600px] text-[16px] leading-7 text-[#DCE6FF] md:text-[17px]">
              We are always looking for passionate problem-solvers. Check out our open positions and join a team that values innovation and culture.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/career" className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 font-semibold text-primary shadow-[0_16px_30px_-16px_rgb(10_6_38/0.7)] transition-[background-color,transform] duration-200 hover:bg-[#E6EEFF] active:scale-[0.97]">
                View Open Positions <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          <span aria-hidden="true" className="relative mx-auto hidden h-[150px] w-[210px] md:block">
            {DIAMONDS.map((dm) => (
              <span key={`${dm.u},${dm.v}`} className="cl-glint absolute h-[30px] w-[30px] rotate-45 rounded-[7px] ring-1 ring-white/30" style={{ left: 90 + dm.u * 28, top: 4 + dm.v * 28, background: dm.color === "#FF0000" ? dm.color : "rgb(255 255 255 / 0.9)", boxShadow: `0 0 20px ${dm.color === "#FF0000" ? dm.color : "rgb(255 255 255 / 0.6)"}`, animationDelay: `${dm.v * 0.14}s` }} />
            ))}
          </span>
        </Reveal>
      </section>
    </>
  );
}
