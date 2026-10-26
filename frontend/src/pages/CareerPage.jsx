import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CheckCircle2, Quote } from "lucide-react";
import ClosingCta from "../components/home/ClosingCta";
import { Label, PageHero, Reveal, Section, Split, Title } from "../components/page/kit";

const ROLES = [
  "Product Manager, AI",
  "Senior Product Manager, Machine Learning",
  "Senior Software Engineer",
  "Software Developer",
  "Senior Data Analyst",
  "Pre-Sales Analyst – Data & Analytics",
];

// Life, Work and Career Development: each a picture beside four points.
const STORIES = [
  {
    label: "Life",
    title: "A Glimpse into our Culture",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
    alt: "Team Culture",
    points: [
      ["Innovation-Driven Culture", "More than a goal, it's a way of life."],
      ["Collaborate, Create, Celebrate", "Every milestone is a shared success."],
      ["Thriving Ideas & Talent Growth", "A space where creativity flourishes."],
      ["Teamwork at the Core", "Success is built on collective effort."],
    ],
  },
  {
    label: "Work",
    title: "Where Passion Fuels Progress",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
    alt: "Office Work",
    points: [
      ["Dynamic & Fast-Paced", "A workplace that keeps you engaged."],
      ["Passion-Driven", "Encouraging bold ideas and breakthroughs."],
      ["Ownership & Responsibility", "Empowering individuals to lead."],
      ["Global Impact", "Driving AI and telecom innovations worldwide."],
    ],
  },
  {
    label: "Career Development",
    title: "Unlock Your Potential",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=80",
    alt: "Career Development",
    points: [
      ["Curiosity & Creativity Valued", "A space for thinkers and doers."],
      ["More Than a Job", "A career with purpose and growth."],
      ["Innovate & Shape the Future", "Be part of AI-driven transformation."],
      ["Opportunities for Growth", "Continuous learning and skill development."],
    ],
  },
];

export default function CareerPage() {
  return (
    <>
      <PageHero
        crumbs={["Career"]}
        label="Career"
        title={
          <>
            Join Cube Software, a global <span className="cl-hi">telecom tech leader,</span> and drive innovation with us!
          </>
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <a href="#roles" className="group inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-7 font-medium text-white transition-colors hover:bg-[#2300DC]">
              Explore Open Roles <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link to="/contact" className="group inline-flex h-12 items-center gap-2 rounded-lg border border-white/25 px-7 font-medium text-white transition-colors hover:bg-white/10">
              Quick Apply <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        }
      />

      <Section id="roles" tone="tint">
        <Reveal className="rounded-[28px] border border-[#E5EAF4] bg-white p-7 shadow-[0_40px_80px_-50px_rgb(0_71_255/0.5)] md:p-10">
          <h3 className="text-2xl font-medium text-[#0A0626]">Top Open Roles</h3>
          <ul className="mt-7 flex flex-wrap gap-3">
            {ROLES.map((role, i) => (
              <Reveal as="li" key={role} delay={i * 0.05}>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-xl border border-[#E5EAF4] bg-white px-5 py-2.5 text-[15px] font-medium text-[#31343A] transition-[border-color,color,translate] duration-200 hover:border-primary hover:text-primary hover:[translate:0_-2px]"
                >
                  {role} <ArrowUpRight size={15} className="opacity-50 transition-opacity group-hover:opacity-100" />
                </Link>
              </Reveal>
            ))}
            <li>
              <Link to="/contact" className="inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#2300DC]">
                View More
              </Link>
            </li>
          </ul>
        </Reveal>
      </Section>

      {STORIES.map((s, i) => (
        <Section key={s.label} tone={i % 2 ? "tint" : "white"}>
          <Split image={s.image} imageAlt={s.alt} reverse={i % 2 === 0}>
            <Label>{s.label}</Label>
            <Title>{s.title}</Title>
            <ul className="mt-7 space-y-4">
              {s.points.map(([head, line]) => (
                <li key={head} className="flex items-start gap-3 text-[16px] leading-7 text-[#404348]">
                  <CheckCircle2 size={20} className="mt-1 shrink-0 text-primary" />
                  <p>
                    <strong className="font-medium text-[#0A0626]">{head}</strong> – {line}
                  </p>
                </li>
              ))}
            </ul>
            <Link to="/meet-our-team" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-[#D5DBE8] px-7 font-medium text-[#31343A] transition-colors hover:border-primary hover:text-primary">
              Explore Gallery <ArrowRight size={16} />
            </Link>
          </Split>
        </Section>
      ))}

      <Section tone="dark">
        <Reveal>
          <h2 className="text-center text-[32px] font-medium text-white md:text-[45px]">Our Culture</h2>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-12 grid max-w-[1000px] items-center gap-10 rounded-[28px] border border-white/10 bg-white/[0.04] p-7 md:grid-cols-[260px_1fr] md:p-10">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80" alt="CHRO" className="aspect-square w-full rounded-[22px] object-cover" />
          <figure className="relative">
            <Quote aria-hidden="true" className="absolute -left-2 -top-6 h-14 w-14 text-white/10" />
            <blockquote className="relative text-[17px] leading-8 text-[#DCE3F5]">
              Our culture is built on a foundation of collaboration, innovation, and a relentless pursuit of excellence. We believe that every voice matters, and we actively encourage open communication, diverse perspectives, and a willingness to take calculated risks. Our team is united by a shared passion and we empower each other to reach our full potential. Together, let's continue to build a workplace where we can not only achieve great things, but also thrive personally and professionally.
            </blockquote>
            <figcaption className="mt-6">
              <span className="block text-lg font-medium text-white">Atul Tiwari</span>
              <span className="text-[#A9B3CC]">Chief Human Resources Officer (CHRO)</span>
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      <ClosingCta
        label="Career"
        title="Ready To Experience The Impact First-Hand?"
        body="Get on a call with us to explore how Cube Software can directly contribute to your business goals and success."
        primary="Contact Us"
      />
    </>
  );
}
