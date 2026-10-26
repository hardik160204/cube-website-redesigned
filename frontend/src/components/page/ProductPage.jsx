import React from "react";
import Faq from "../home/Faq";
import ClosingCta from "../home/ClosingCta";
import Products from "../home/Products";
import { CONTACT } from "../home/catalog";
import { CheckList, CtaButtons, FeatureCards, Heading, Label, ModuleCards, PageHero, Prose, Section, Split, Tiles, Title, TrustBand } from "./kit";

// One layout for every Cube product page. Each page keeps its own PAGE_DATA (copy unchanged) and passes
// the few words that differ: the breadcrumb, the overview's highlighted phrase and its picture.
export default function ProductPage({
  data,
  enterprise,
  crumb = "Products",
  highlight,
  overviewImage,
  heroImage,
  heroMedia,
  showStats = true,
  overviewLead = "The Intelligence Behind Modern",
  featuresTitle = `Everything ${data.title} gives your team`,
  enterpriseTitle = "Empowering business-critical communications with reliability and security.",
  benefitsTitle = "Why businesses choose it",
  modules,
  modulesTitle,
  ctaBody = "Talk to our telephony experts and get a tailored demo for your business within 24 hours.",
}) {
  const image = overviewImage || data.overviewImage;
  const video = data.heroVideo && data.heroVideo.endsWith(".mp4") ? data.heroVideo : undefined;
  return (
    <>
      <PageHero
        crumbs={[crumb, data.title]}
        label={crumb}
        title={data.title}
        body={data.tagline}
        video={video}
        image={heroImage}
        media={heroMedia}
        imageAlt={data.title}
        stats={showStats ? data.stats : undefined}
        actions={<CtaButtons primary="Book Demo" secondary="Talk to Sales" phone={CONTACT.sales} dark />}
      />

      <TrustBand />

      <Section tone="tint">
        {image ? (
          <Split image={image} imageAlt={`${data.title} Overview`}>
            <Label>Overview</Label>
            <Title highlight={highlight}>{overviewLead}</Title>
            <Prose paragraphs={data.overview} className="mt-6" />
            <CtaButtons primary="Book A Demo" secondary={null} className="mt-9" />
          </Split>
        ) : (
          <div className="mx-auto max-w-[860px] text-center">
            <Heading label="Overview" title={overviewLead} highlight={highlight} align="center" />
            <Prose paragraphs={data.overview} className="mt-6 text-left" />
            <CtaButtons primary="Book A Demo" secondary={null} className="mt-9 justify-center" />
          </div>
        )}
      </Section>

      <Section>
        <Heading title={featuresTitle} align="center" />
        <FeatureCards items={data.features} className="mt-12" />
      </Section>

      {modules && (
        <Section tone="tint">
          <Heading label="Modules" title={modulesTitle} />
          <ModuleCards modules={modules} className="mt-12" />
        </Section>
      )}

      <Section tone="dark">
        <Heading label="Key Features" title={enterpriseTitle} dark />
        <FeatureCards items={enterprise} cols={4} dark className="mt-12" />
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <Label>Business Benefits</Label>
            <Title>{benefitsTitle}</Title>
            <CheckList items={data.benefits} className="mt-8" />
          </div>
          <div>
            <Label>Use Cases</Label>
            <Title>Perfect for</Title>
            <Tiles items={data.useCases} className="mt-8" />
          </div>
        </div>
      </Section>

      <div className="bg-[#F0F4FB]">
        <Faq items={data.faqs} label="FAQ" title="Common" highlight="Questions" id="faq" />
      </div>

      <ClosingCta
        label={data.title}
        title={`Ready to deploy ${data.title}?`}
        body={ctaBody}
        primary="Book a Free Demo"
      />

      <Products />
    </>
  );
}
