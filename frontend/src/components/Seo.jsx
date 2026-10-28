import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ROUTES from "../seo/routes.json";
import { recordPageView } from "../lib/consent";

// Keeps the page title, description and canonical link right as visitors move between pages. The server
// writes the same tags into the HTML for search engines (server/src/seo.js reads the same routes.json).

function tag(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = Object.assign(document.createElement(create.tag), create.attrs);
    document.head.appendChild(el);
  }
  return el;
}

export function setHead({ title, description, path }) {
  document.title = title;
  tag('meta[name="description"]', { tag: "meta", attrs: { name: "description" } }).setAttribute("content", description);
  tag('meta[property="og:title"]', { tag: "meta", attrs: { property: "og:title" } }).setAttribute("content", title);
  tag('meta[property="og:description"]', { tag: "meta", attrs: { property: "og:description" } }).setAttribute("content", description);
  tag('link[rel="canonical"]', { tag: "link", attrs: { rel: "canonical" } }).setAttribute("href", window.location.origin + path);
}

export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.replace(/\/+$/, "") || "/";
    const meta = ROUTES[path];
    if (meta) setHead({ title: meta.title, description: meta.description, path: meta.canonical || path });
    recordPageView(path);
  }, [pathname]);
  return null;
}
