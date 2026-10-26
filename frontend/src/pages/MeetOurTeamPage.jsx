import React from "react";
import { Link } from "react-router-dom";
import { Camera, Briefcase, Award, Zap, MessageSquare, Globe, Coffee } from "lucide-react";
import { FeatureCards, Heading, LinkPair, PageHero, Reveal, Section } from "../components/page/kit";

// Placeholder for the office team hero background
const TEAM_HERO_IMAGE = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80";

const VALUES = [
  { icon: Zap, title: "Innovation First", desc: "We don't just follow industry trends; we build the features that define the future of cloud communication." },
  { icon: Globe, title: "Customer Centric", desc: "Every line of code we write and every server we deploy is designed to make our customers' lives easier and their businesses more profitable." },
  { icon: Award, title: "Uncompromising Quality", desc: "We believe in 99.99% uptime, crystal clear audio, and delivering a premium enterprise experience to businesses of all sizes." },
];

const LEADERS = [
  {
    name: "Praveen Varshney",
    role: "Director",
    image: "praveensir-image.png",
    bio: "Visionary leader driving innovation in cloud telecommunications for over 20 years. Praveen spearheads our strategic growth, consistently forging enterprise partnerships that define the future of global connectivity.",
    linkedin: "#",
  },
  {
    name: "Nirupma Kumar Sinha",
    role: "Director",
    image: "sinha-sir-image.webp",
    bio: "Driving operational excellence and corporate governance across all divisions. Nirupma ensures sustainable long-term value for our enterprise partners through meticulous strategy and risk management.",
    linkedin: "#",
  },
  {
    name: "Rajeev Varshney",
    role: "Chief Technical Officer",
    image: "rajeev-sir-image.webp",
    bio: "The architect behind our robust, highly scalable, zero-downtime cloud infrastructure. Rajeev leads our core R&D initiatives, pushing the boundaries of AI-driven telecommunications.",
    linkedin: "#",
  },
  {
    name: "Vivek Gupta",
    role: "Chief Operating Officer",
    image: "vivek-sir-image.webp",
    bio: "Mastermind behind our seamless day-to-day operations and unmatched customer success delivery. Vivek streamlines cross-functional team efficiencies to ensure rapid product deployment.",
    linkedin: "https://www.linkedin.com/in/vivek-gupta-056b5230",
  },
  {
    name: "Surendra Kumar",
    role: "Head Of Finance Department",
    image: "surendar-sir-image.webp",
    bio: "Crafting our global brand narrative and expanding our market footprint. Anita leverages data-driven digital strategies to position Cube Software as the undisputed leader in cloud telephony.",
    linkedin: "#",
  },
  {
    name: "Imran Ahmad",
    role: "VP Direct Sales",
    image: "imran-sir-image.webp",
    bio: "Building lasting relationships with Fortune 500 clients. Ravi leads our high-performance global sales organization, tailoring complex communication architectures to meet specific client needs.",
    linkedin: "#",
  },
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

// A leader's card: portrait on top; on hover (or keyboard focus) the bio slides up over the portrait.
function LeaderCard({ m, i }) {
  const hasLink = m.linkedin && m.linkedin !== "#";
  return (
    <Reveal as="li" delay={Math.min(i, 5) * 0.07}>
      <article tabIndex={0} className="group relative overflow-hidden rounded-[28px] border border-[#E5EAF4] bg-white outline-none transition-[box-shadow,translate] duration-300 ease-out-expo hover:shadow-[0_30px_60px_-30px_rgb(0_71_255/0.5)] hover:[translate:0_-4px] focus-visible:ring-2 focus-visible:ring-primary">
        <div className="relative h-80 overflow-hidden bg-[#E6EEFF]">
          <img src={m.image} alt={m.role} loading="lazy" className="h-full w-full object-cover object-top transition-[scale] duration-700 ease-out-expo group-hover:[scale:1.05]" />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0A0626] via-[#0A0626]/85 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <p className="translate-y-3 text-sm leading-6 text-[#DCE3F5] transition-transform duration-300 ease-out-expo group-hover:translate-y-0 group-focus-within:translate-y-0">{m.bio}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 p-5">
          <div>
            <h3 className="text-lg font-medium text-[#0A0626]">{m.name}</h3>
            <p className="text-sm text-primary">{m.role}</p>
          </div>
          {hasLink && (
            <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} LinkedIn Profile`} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5EAF4] text-[#0A66C2] transition-colors hover:bg-[#0A66C2] hover:text-white">
              <LinkedIn />
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function MeetOurTeamPage() {
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
          {LEADERS.map((m, i) => (
            <LeaderCard key={m.name} m={m} i={i} />
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

      <Section tone="dark">
        <Heading title="The Engines of" highlight="Our Growth" align="center" dark />
        <FeatureCards items={DEPARTMENTS} cols={4} dark className="mt-12" />
      </Section>

      <section className="w-full bg-[linear-gradient(110deg,#2300DC_0%,#0047FF_55%,#0091FF_100%)]">
        <Reveal className="mx-auto flex max-w-[1100px] flex-col items-center px-4 py-14 text-center md:py-[72px]">
          <Coffee size={40} className="text-[#00B8FF]" />
          <h2 className="mt-4 text-[28px] font-medium leading-[1.2] text-white md:text-[40px] xl:text-[48px]">Want to build the future with us?</h2>
          <p className="mt-5 max-w-[720px] text-[15px] leading-7 text-[#DCE6FF] md:text-[17px]">
            We are always looking for passionate problem-solvers. Check out our open positions and join a team that values innovation and culture.
          </p>
          <Link to="/career" className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-white px-7 font-semibold text-primary transition-colors hover:bg-[#E6EEFF]">
            View Open Positions
          </Link>
        </Reveal>
      </section>
    </>
  );
}
