import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pagePath } from "../lib/content";
import { editing } from "../lib/editable";
import { useSiteData } from "../lib/site";
import ROUTES from "../seo/routes.json";
import { HeroOrb, LinkPair, PageHero } from "./page/kit";

// Pages switched off in the dashboard show this message instead. An admin who is editing the website still gets
// the page itself, so a page can be prepared while visitors can't see it.

export const DEFAULT_OFF = { title: "We're giving this page a fresh look", message: "It will be back soon. In the meantime, our team is happy to help." };

function PageOff({ off, home }) {
  useEffect(() => {
    const tag = Object.assign(document.createElement("meta"), { name: "robots", content: "noindex" });
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);
  return (
    <PageHero
      full
      title={off.title || DEFAULT_OFF.title}
      body={off.message || DEFAULT_OFF.message}
      media={<HeroOrb always />}
      actions={<LinkPair primary={home ? { label: "Contact us", to: "/contact" } : { label: "Back to home", to: "/" }} secondary={home ? null : { label: "Contact us", to: "/contact" }} />}
    />
  );
}

export default function PageGate({ children }) {
  const path = pagePath(useLocation().pathname);
  const { pagesOff } = useSiteData();
  // Two addresses can show one page; a blog post goes with the blog.
  const page = path.startsWith("/blog/") ? "/blog" : ROUTES[path]?.canonical || path;
  if (!pagesOff?.paths?.includes(page)) return children;
  if (!editing()) return <PageOff off={pagesOff} home={path === "/"} />;
  return (
    <>
      <p data-cube-ui="" className="bg-[#FFF4D6] px-4 py-2 text-center text-[13px] font-medium text-[#7A4A00]">
        This page is switched off: visitors see a “back soon” message. Turn it back on in the dashboard's Pages section.
      </p>
      {children}
    </>
  );
}
