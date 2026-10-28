import React from "react";
import { Award, Target, Eye, HeartHandshake, Quote } from "lucide-react";
import ClosingCta from "../components/home/ClosingCta";
import { FeatureCards, Heading, Label, LinkPair, PageHero, Reveal, Section, Split, Timeline, Title } from "../components/page/kit";

// --- HARDCODED IMAGES ---
const ABOUT_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80";
// The directors' messages, with their portraits from the Meet Our Team page. The vision message is the site's
// former founder's message; the mission message is drafted from the site's own copy for the directors to approve.
const DIRECTORS = [
  {
    label: "Our Vision",
    title: "A Message on Our",
    highlight: "Vision",
    name: "Nirupma Kumar Sinha",
    role: "Director",
    image: "/sinha-sir-image.webp",
    message:
      "We at Cube Software are happy to revolutionize the world with the power of cloud telephony. We look forward for developing a cloud telephony network which is reachable to every business, be it a well-established business or new start-up or an entrepreneur. Our strength is our quality of service on which we never compromise.",
  },
  {
    label: "Our Mission",
    title: "A Message on Our",
    highlight: "Mission",
    name: "Praveen Varshney",
    role: "Director",
    image: "/praveensir-image.png",
    message:
      "Our mission is to give every business, from a five-seat team to a thousand-seat floor, communication software that is built in-house, deployed quickly and supported around the clock. For more than three decades we have engineered Computer Telephony Integration that works seamlessly with the world's leading telecom vendors, and we measure ourselves by one thing: the quality of service our customers receive.",
  },
];

const MILESTONES = [
  { year: "1990", text: "Cube Software is founded, pioneering Computer Telephony Integration in India." },
  { year: "1998", text: "Callisto Voice Logger launches, becoming a recording standard for hotels, banks and helplines." },
  { year: "2005", text: "Quick Call Dialer powers some of the country's largest BPO floors." },
  { year: "2012", text: "Enterprise rollouts with international telecom vendors across multiple continents." },
  { year: "2018", text: "Cloud-hosted telephony suite debuts — dialer and logger without hardware." },
  { year: "2026", text: "AI-powered routing, transcription and analytics join the platform." },
];

const VALUES = [
  { icon: Award, title: "Engineering Excellence", text: "Home-grown software refined over three decades of real-world telecom deployments." },
  { icon: HeartHandshake, title: "Customer Obsession", text: "24/7 support and long-term partnerships — many clients have stayed with us for 20+ years." },
  { icon: Target, title: "Practical Innovation", text: "We adopt new technology when it solves real problems, from CTI cards to cloud and AI." },
  { icon: Eye, title: "Transparency", text: "Clear pricing, honest timelines and solutions sized to what you actually need." },
];

export const STATS = [
  { value: "35+", label: "Years in Business" },
  { value: "5,000+", label: "Deployments" },
  { value: "10+", label: "Countries Reached" },
  { value: "20+", label: "Product Lines" },
];

const AboutPage = () => (
  <>
    <PageHero
      crumbs={["About Us"]}
      label="About Us"
      title="35+ Years of Telephony,"
      highlight="Engineered with Passion"
      body="At Cube Software we have been designing Computer Telephony Integration software for over three decades — deploying products that work seamlessly with the communication solutions of the world's leading telecom vendors."
      backdrop={ABOUT_IMAGE}
      stats={STATS}
      actions={<LinkPair primary={{ label: "Work With Us", to: "/contact" }} secondary={{ label: "Meet Our Team", to: "/meet-our-team" }} />}
    />

    {DIRECTORS.map((d, i) => (
      <Section key={d.name} tone={i % 2 ? "tint" : "white"}>
        <Split image={d.image} imageAlt={d.name} reverse={i % 2 === 0}>
          <Label>{d.label}</Label>
          <Title highlight={d.highlight}>{d.title}</Title>
          <figure className="relative mt-8">
            <Quote aria-hidden="true" className="absolute -left-2 -top-6 h-16 w-16 text-[#D9E6FF]" strokeWidth={1.5} />
            <blockquote className="relative text-[18px] font-medium leading-[1.7] text-[#31343A] md:text-[20px]">"{d.message}"</blockquote>
            <figcaption className="mt-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[linear-gradient(90deg,#00B8FF,#0047FF)]" />
              <span>
                <span className="block text-lg font-medium text-[#0A0626]">{d.name}</span>
                <span className="text-sm text-primary">{d.role}, Cube Software</span>
              </span>
            </figcaption>
          </figure>
        </Split>
      </Section>
    ))}

    <Section>
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <Label>Milestones</Label>
          <Title>Three decades of firsts</Title>
        </Reveal>
        <Timeline items={MILESTONES} />
      </div>
    </Section>

    <Section tone="dark">
      <Heading label="Our Values" title="What we stand for" dark />
      <FeatureCards items={VALUES.map((v) => ({ ...v, desc: v.text }))} cols={4} dark className="mt-12" />
    </Section>

    <ClosingCta label="About Cube" title="Let's build your communication stack together" body="Three decades of telephony expertise, one conversation away." primary="Contact Us" />
  </>
);

export default AboutPage;
