import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import ClosingCta from "../components/home/ClosingCta";
import { readMinutes, usePosts } from "../components/blog-posts";
import { ACCENTS, PageHero, Reveal, Section } from "../components/page/kit";

// Cover art for a post: the post's icon glowing on the dark ink grid, in its own logo colour.
export function PostCover({ post, i, big = false }) {
  const accent = ACCENTS[i % ACCENTS.length];
  return (
    <div className={`relative isolate overflow-hidden rounded-[20px] bg-[#0A0626] ${big ? "aspect-[16/10] lg:aspect-auto lg:h-full" : "aspect-[16/9]"}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[60px] transition-opacity duration-500 group-hover:opacity-80" style={{ background: accent }} />
      {post.cover && <img src={post.cover} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
      {!post.cover && <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl text-white transition-transform duration-500 ease-out-expo group-hover:[transform:translate(-50%,-50%)_rotate(-8deg)_scale(1.08)]" style={{ background: accent, boxShadow: `0 20px 40px -12px ${accent}` }}>
        <post.icon size={36} />
      </span>}
      <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur">{post.category}</span>
    </div>
  );
}

export function PostCard({ post, i }) {
  return (
    <Reveal as="li" delay={(i % 3) * 0.08} className="h-full">
      <Link
        to={`/blog/${post.slug}`}
        className="group flex h-full flex-col rounded-[28px] border border-[#E5EAF4] bg-white p-3 transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:border-[#99B5FF] hover:shadow-[0_30px_60px_-30px_rgb(0_71_255/0.45)] hover:[translate:0_-6px]"
      >
        <PostCover post={post} i={i} />
        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          <span className="flex items-center gap-1.5 text-[13px] text-[#6B6E75]">
            <Clock size={13} /> {readMinutes(post)} min read
          </span>
          <h3 className="mt-2 text-[20px] font-medium leading-snug text-[#0A0626] transition-colors group-hover:text-primary">{post.title}</h3>
          <p className="mt-2 line-clamp-3 text-[15px] leading-6 text-[#4A4D53]">{post.excerpt}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-medium text-primary">
            Read article <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function BlogPage() {
  const { posts: POSTS } = usePosts();
  const categories = ["All", ...new Set(POSTS.map((p) => p.category))];
  const [active, setActive] = useState("All");
  const [featured, ...rest] = POSTS;
  const shown = active === "All" ? rest : POSTS.filter((p) => p.category === active);

  return (
    <>
      <PageHero
        crumbs={["Blog"]}
        label="Cube Blog"
        title="Insights on"
        highlight="cloud telephony."
        body="Practical guides on contact centers, IVR, dialers, call recording and integrations, from the team that has built telephony software since 1990."
        actions={<span />}
      />

      <Section tone="tint">
        {active === "All" && featured && (
          <Reveal>
            <Link
              to={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-[32px] border border-[#E5EAF4] bg-white p-3 transition-[box-shadow,border-color] duration-300 hover:border-[#99B5FF] hover:shadow-[0_40px_80px_-40px_rgb(0_71_255/0.5)] lg:grid-cols-[1.1fr_1fr]"
            >
              <PostCover post={featured} i={1} big />
              <div className="flex flex-col justify-center p-6 lg:p-12">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Featured · {readMinutes(featured)} min read</span>
                <h2 className="mt-4 text-[28px] font-medium leading-[1.15] text-[#0A0626] md:text-[36px]">{featured.title}</h2>
                <p className="mt-4 text-[17px] leading-7 text-[#4A4D53]">{featured.excerpt}</p>
                <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white transition-colors group-hover:bg-[#2300DC]">
                  Read article <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        <div role="tablist" aria-label="Filter articles" className="mt-12 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active === c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active === c ? "border-primary bg-primary text-white" : "border-[#D5DBE8] bg-white text-[#31343A] hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <PostCard key={p.slug} post={p} i={POSTS.indexOf(p)} />
          ))}
        </ul>
      </Section>

      <ClosingCta label="Cube Blog" title="Questions about your setup?" body="Tell us about your call volumes and our experts will help you choose the right setup." />
    </>
  );
}
