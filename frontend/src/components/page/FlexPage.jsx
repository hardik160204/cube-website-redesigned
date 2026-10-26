import React from "react";
import ClosingCta from "../home/ClosingCta";
import { HeroScene } from "./HeroScenes";
import Products from "../home/Products";
import { CheckList, CtaButtons, FeatureCard, FeatureCards, Heading, IconTiles, Label, PageHero, Prose, Reveal, Section, Split, Steps, Title, TrustBand } from "./kit";

// Renders a page from its sections' data (see any page that imports it). Each section's copy stays exactly
// as written; the layout is chosen from what the section holds: steps, cards, a picture, a list or text.
export const Hi = ({ children }) => <span className="cl-hi">{children}</span>;

const isLong = (cards) => cards.reduce((n, c) => n + (c.desc || "").length, 0) / cards.length > 110;
const cardCols = (cards) => (cards.length % 3 === 0 ? 3 : cards.length === 4 ? (isLong(cards) ? 2 : 4) : cards.length === 2 ? 2 : 3);

function Body({ s, dark, align }) {
  return (
    <>
      {s.body && <Prose paragraphs={s.body} dark={dark} className={`mt-6 ${align === "center" ? "mx-auto max-w-[760px] text-center" : ""}`} />}
      {s.more && s.more.map((m, i) => <Title key={i} dark={dark} className="mt-10">{m}</Title>)}
    </>
  );
}

function Block({ s, tone }) {
  if (s.render) return s.render;
  const dark = tone === "dark";
  const cards = s.cards || [];

  if (s.steps && cards.length) {
    return (
      <Section tone="dark">
        <Heading label={s.label} title={s.title} align="center" dark />
        <Body s={s} dark align="center" />
        <Steps items={cards} dark className="mt-14" />
      </Section>
    );
  }

  // Picture (or icon diagram) beside copy and any list; cards, if any, follow underneath.
  if (s.image || s.tiles) {
    return (
      <Section tone={tone}>
        <Split image={s.image} imageAlt={s.imageAlt} dark={dark} media={s.image ? null : <IconTiles tiles={s.tiles} dark={dark} />} bare={!s.image}>
          {s.label && <Label dark={dark}>{s.label}</Label>}
          {s.title && <Title dark={dark}>{s.title}</Title>}
          <Body s={s} dark={dark} />
          {s.list && <CheckList items={s.list} dark={dark} className="mt-7" />}
          {s.button && <CtaButtons primary={s.button} secondary={null} className="mt-9" />}
        </Split>
        {cards.length > 0 && <FeatureCards items={cards} cols={cardCols(cards)} dark={dark} className="mt-14" />}
      </Section>
    );
  }

  // A list with a couple of highlight cards: list on the left, the cards stacked as the "picture".
  if (s.list && cards.length > 0 && cards.length <= 3) {
    return (
      <Section tone={tone}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            {s.label && <Label dark={dark}>{s.label}</Label>}
            {s.title && <Title dark={dark}>{s.title}</Title>}
            <Body s={s} dark={dark} />
            <CheckList items={s.list} dark={dark} className="mt-8" />
          </Reveal>
          <div className="relative rounded-[32px] bg-[linear-gradient(135deg,#E3F6FF,#E6EEFF_55%,#EDE8FF)] p-6 sm:p-10">
            <ul className="relative grid gap-4">
              {cards.map((c, i) => (
                <FeatureCard key={c.title} {...c} i={i} />
              ))}
            </ul>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section tone={tone}>
      {(s.title || s.label) && <Heading label={s.label} title={s.title} align={cards.length ? "center" : "left"} dark={dark} />}
      <Body s={s} dark={dark} align={cards.length ? "center" : "left"} />
      {s.list && <CheckList items={s.list} dark={dark} cols={s.list.length > 5 ? 2 : 1} className="mt-8" />}
      {cards.length > 0 && <FeatureCards items={cards} cols={cardCols(cards)} dark={dark} className="mt-12" />}
      {s.button && <CtaButtons primary={s.button} secondary={null} className={`mt-10 ${cards.length ? "justify-center" : ""}`} />}
    </Section>
  );
}

export default function FlexPage({ sections, crumbs, related = false }) {
  const [hero, ...rest] = sections;
  const cta = rest.find((s) => s.kind === "cta");
  const blocks = rest.filter((s) => s !== cta);
  let light = 0;
  return (
    <>
      <PageHero
        crumbs={crumbs}
        label={hero.label}
        title={hero.title}
        body={hero.body && hero.body[0]}
        image={hero.image}
        imageAlt={hero.imageAlt}
        media={hero.scene ? <HeroScene name={hero.scene} /> : !hero.image && hero.tiles ? <IconTiles tiles={hero.tiles} dark /> : null}
        actions={<CtaButtons primary={hero.button || "Book a demo"} dark />}
      >
        {hero.body && hero.body.length > 1 && <Prose paragraphs={hero.body.slice(1)} dark className="mt-6 max-w-[620px] text-base" />}
        {hero.list && <CheckList items={hero.list} dark className="mt-8" />}
      </PageHero>

      {blocks.map((s, i) => (
        <Block key={i} s={s} tone={s.steps || s.render ? "dark" : light++ % 2 ? "tint" : "white"} />
      ))}

      {related && <TrustBand />}

      {related && <Products />}

      <ClosingCta
        label={cta ? "Get started" : undefined}
        title={cta ? cta.title : undefined}
        body={cta && cta.body ? cta.body.join(" ") : undefined}
        primary={cta && cta.button ? cta.button : undefined}
      />
    </>
  );
}
