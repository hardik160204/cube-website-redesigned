import React, { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock } from "lucide-react";
import ClosingCta from "../components/home/ClosingCta";
import { readMinutes, usePosts } from "../components/blog-posts";
import { Heading, PageHero, Section } from "../components/page/kit";
import { PostCard, PostCover } from "./BlogPage";
import { setHead } from "../components/Seo";

// One blog article: hero, the article body at a comfortable reading width, then three more posts.
export default function BlogPostPage() {
  const { slug } = useParams();
  const { posts: POSTS, loaded } = usePosts();
  const post = POSTS.find((p) => p.slug === slug);
  useEffect(() => {
    if (post) setHead({ title: `${post.title} | Cube Software Blog`, description: post.excerpt, path: `/blog/${post.slug}` });
  }, [post]);
  if (!post) return loaded ? <Navigate to="/blog" replace /> : <div className="min-h-[70vh]" aria-busy="true" />;
  const i = POSTS.indexOf(post);
  const more = POSTS.filter((p) => p !== post).slice(0, 3);

  return (
    <>
      <PageHero
        crumbs={["Blog", post.category]}
        label={post.category}
        title={post.title}
        body={post.excerpt}
        media={
          <div className="group mx-auto w-full max-w-[460px]">
            <PostCover post={post} i={i} />
          </div>
        }
        actions={
          <span className="inline-flex items-center gap-2 text-sm text-[#A9B3CC]">
            <Clock size={15} /> {readMinutes(post)} min read · Cube Software Team
          </span>
        }
      />

      <Section>
        <article className="mx-auto max-w-[760px]">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ArrowLeft size={15} /> All articles
          </Link>
          <div className="mt-8 space-y-6 text-[18px] leading-8 text-[#31343A]">
            {post.body.map((b, k) =>
              typeof b === "string" ? (
                <p key={k} className={k === 0 ? "text-[20px] leading-9 text-[#0A0626] first-letter:float-left first-letter:mr-2 first-letter:text-[56px] first-letter:font-semibold first-letter:leading-[0.9] first-letter:text-primary" : ""}>
                  {b}
                </p>
              ) : b.h ? (
                <h2 key={k} className="pt-4 text-[26px] font-medium leading-snug text-[#0A0626]">
                  {b.h}
                </h2>
              ) : (
                <ul key={k} className="space-y-3 rounded-[22px] border border-[#E5EAF4] bg-[#F7F9FD] p-6">
                  {b.list.map((li) => (
                    <li key={li} className="flex items-start gap-3 text-[17px] leading-7">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D9F3FF] text-[#0047FF]">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {li}
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </article>
      </Section>

      <Section tone="tint">
        <Heading label="Keep reading" title="More from the" highlight="Cube blog." />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((p) => (
            <PostCard key={p.slug} post={p} i={POSTS.indexOf(p)} />
          ))}
        </ul>
      </Section>

      <ClosingCta />
    </>
  );
}
