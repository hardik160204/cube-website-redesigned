import React from "react";
import { PageHero, Reveal, Section } from "./kit";

// Layout for the legal pages: a short hero, a sticky contents list and the numbered sections.
export default function LegalDoc({ title, highlight, intro, updated, sections }) {
  return (
    <>
      <PageHero crumbs={[`${title} ${highlight}`]} label="Legal" title={title} highlight={highlight} body={intro} actions={<span />} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
          <nav aria-label="Contents" className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Contents</p>
            <ol className="mt-4 space-y-2 text-[14px]">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#s${i + 1}`} className="flex gap-2 text-[#4A4D53] transition-colors hover:text-primary">
                    <span className="font-mono text-[#9CA3AF]">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-[#6B6E75]">Last updated: {updated}</p>
          </nav>
          <div className="max-w-[820px] space-y-10">
            {sections.map((s, i) => (
              <Reveal key={s.title} as="section" id={`s${i + 1}`} className="scroll-mt-36">
                <h2 className="text-[24px] font-medium text-[#0A0626]">
                  <span className="mr-3 font-mono text-base text-primary">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4 text-[16px] leading-7 text-[#404348]">
                  {s.body.map((b, k) =>
                    Array.isArray(b) ? (
                      <ul key={k} className="list-disc space-y-2 pl-5 marker:text-primary">
                        {b.map((li) => (
                          <li key={li}>{li}</li>
                        ))}
                      </ul>
                    ) : (
                      <p key={k}>{b}</p>
                    )
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
