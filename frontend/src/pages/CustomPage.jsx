import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "../lib/api";
import { pagePath } from "../lib/content";
import { ICONS } from "../lib/editable";
import FlexPage, { Hi } from "../components/page/FlexPage";
import { setHead } from "../components/Seo";

// Pages built in the admin's Pages section. Any address the site doesn't know comes here: a published page
// at that address is drawn with the product-page layout; a draft shows only to a signed-in admin, as a
// preview; anything else sends the visitor to the homepage, as before.

const some = (a) => (a && a.length ? a : undefined);
const withIcons = (tiles) => some(tiles)?.map((t) => ({ ...t, icon: ICONS.get(t.icon) }));
// [Words in square brackets] show in the highlight colour.
const plainTitle = (t) => (t || "").replace(/[[\]]/g, "");
const heading = (t) => (t ? t.split(/\[(.+?)\]/).map((part, i) => (i % 2 ? <Hi key={i}>{part}</Hi> : part)) : undefined);

// The stored page -> FlexPage's sections (empty parts left out, icons from their names).
function sectionsOf(c) {
  return [
    {
      label: c.hero.label,
      title: heading(c.hero.title),
      body: some(c.hero.body),
      list: some(c.hero.list),
      image: c.hero.image || undefined,
      imageAlt: plainTitle(c.hero.title),
      button: c.hero.button || undefined,
      scene: c.hero.scene || undefined,
      stats: some(c.hero.stats),
      tiles: withIcons(c.hero.tiles),
    },
    ...c.sections.map((s) => ({
      label: s.label || undefined,
      title: heading(s.title),
      body: some(s.body),
      list: some(s.list),
      cards: s.cards.map((x) => ({ ...x, icon: ICONS.get(x.icon) })),
      steps: s.steps || undefined,
      dark: s.dark || undefined,
      image: s.image || undefined,
      imageAlt: plainTitle(s.title),
      button: s.button || undefined,
      numbered: some(s.numbered),
      faqs: some(s.faqs),
      tiles: withIcons(s.tiles),
    })),
    ...(c.cta ? [{ kind: "cta", title: c.cta.title || undefined, body: some(c.cta.body), button: c.cta.button || undefined }] : []),
  ];
}

export default function CustomPage() {
  const path = pagePath(useLocation().pathname);
  const [found, setFound] = useState({ path: null });

  useEffect(() => {
    let live = true;
    api(`/page?path=${encodeURIComponent(path)}`)
      .then(({ page }) => ({ page }))
      .catch(() =>
        api("/admin/pages")
          .then(({ pages }) => {
            const page = pages.find((p) => p.path === path);
            return page ? { page, draft: !page.published } : {};
          })
          .catch(() => ({}))
      )
      .then((r) => {
        if (!live) return;
        setFound({ path, ...r });
        if (r.page) setHead({ title: r.page.title, description: r.page.description || "", path });
      });
    return () => {
      live = false;
    };
  }, [path]);

  if (found.path !== path) return <div className="min-h-[70vh]" aria-busy="true" />;
  if (!found.page) return <Navigate to="/" replace />;
  const c = found.page.content;
  return (
    <>
      {found.draft && (
        <p className="sticky top-0 z-40 bg-[#FFF4D6] px-4 py-2 text-center text-[13px] font-medium text-[#7A4A00]">
          Draft preview — only signed-in admins can see this page. Publish it in the dashboard's Pages section.
        </p>
      )}
      <FlexPage sections={sectionsOf(c)} crumbs={[c.hero.label || "Pages", plainTitle(c.hero.title)]} related={c.related} />
    </>
  );
}
