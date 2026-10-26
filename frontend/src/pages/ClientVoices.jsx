import React from "react";
import ClosingCta from "../components/home/ClosingCta";
import { ClientStories } from "../components/home/Testimonials";
import { Heading, PageHero, Section } from "../components/page/kit";

// Client voices: one story card per company Cube works with (components/clients-and-partners.js). Add a client's
// review there and it shows here and on the homepage.
export default function ClientVoices() {
  return (
    <>
      <PageHero
        crumbs={["Client Voices"]}
        label="Client Voices & Success Stories"
        title="Trusted by India's Leading"
        highlight="Enterprise Brands"
        body="Discover how enterprises across travel, healthcare, finance, and BPO sectors scale their communication infrastructure with Cube Software."
      />

      <Section tone="tint">
        <Heading label="Client voices" title="In their" highlight="own words." />
        <ClientStories className="mt-10" />
      </Section>

      <ClosingCta
        label="Client Voices"
        title="Ready to join our success stories?"
        body="Upgrade your enterprise communication stack with robust telephony solutions engineered for high-performance scale."
        primary="Book a Free Enterprise Demo"
      />
    </>
  );
}
