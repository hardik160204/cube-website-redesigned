import React, { useEffect, useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import ROUTES from "../seo/routes.json";
import { Button, Card, Empty, Field, INPUT, PageTitle, act, useResource } from "./ui";

// Google Analytics (visitors), Search Console (how the site does in Google search) and their reports, set up and
// read from here. Both are Google's own free tools; Looker Studio, also free, turns them into reports shown below.

const LOOKER = /^https:\/\/lookerstudio\.google\.com\/(embed\/)?(u\/\d+\/)?reporting\/[A-Za-z0-9-]+(\/page\/[A-Za-z0-9_-]+)?\/?(\?[^\s<>"']*)?$/;
const embedUrl = (u) => u.replace(/\/u\/\d+\//, "/").replace("/reporting/", "/embed/reporting/").replace("/embed/embed/", "/embed/");
const DEFAULT = { gaId: "", searchConsole: "", googleMeta: "", bing: "", reports: [] };
// People often paste the whole tag; keep just the code.
const codeOf = (v) => (v.match(/content=["']([^"']+)["']/)?.[1] || v.match(/<user>\s*([^<\s]+)\s*<\/user>/)?.[1] || v).trim();

function Steps({ items }) {
  return (
    <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[13px] leading-6 text-[#404348]">
      {items.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ol>
  );
}

// Titles and descriptions as Google shows them: too long gets cut off, too short wastes the space.
function SeoCheck({ canPages, out }) {
  const [built] = useResource(canPages ? "/admin/pages" : null, out);
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    api("/posts")
      .then((d) => setPosts(d.posts || []))
      .catch(() => setPosts([]));
  }, []);
  const rows = [
    ...Object.entries(ROUTES)
      .filter(([, m]) => !m.canonical && !m.noindex)
      .map(([path, m]) => ({ path, title: m.title, description: m.description })),
    ...(built?.pages || []).filter((p) => p.published).map((p) => ({ path: p.path, title: p.title, description: p.description })),
    ...(posts || []).map((p) => ({ path: `/blog/${p.slug}`, title: `${p.title} | Cube Software Blog`, description: p.excerpt })),
  ].map((r) => {
    const issues = [];
    if (r.title.length > 60) issues.push(`title is ${r.title.length} characters, Google shows about 60`);
    if (r.title.length < 15) issues.push("title is short");
    if (!r.description) issues.push("no description");
    else if (r.description.length > 160) issues.push(`description is ${r.description.length} characters, Google shows about 160`);
    else if (r.description.length < 70) issues.push("description is short");
    return { ...r, issues };
  });
  const titles = new Map();
  rows.forEach((r) => titles.set(r.title, (titles.get(r.title) || 0) + 1));
  rows.forEach((r) => titles.get(r.title) > 1 && r.issues.push("same title as another page"));
  const fine = rows.filter((r) => !r.issues.length).length;
  return (
    <Card title={`SEO check (${fine} of ${rows.length} pages look good)`}>
      <p className="text-[13px] text-[#6B6E75]">Every page's title and description, as they appear in Google results. Pages, blog posts and their words are checked automatically.</p>
      <ul className="mt-3 max-h-[420px] divide-y divide-[#EEF1F7] overflow-y-auto text-[13px]">
        {rows
          .sort((a, b) => b.issues.length - a.issues.length)
          .map((r) => (
            <li key={r.path} className="py-2.5">
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-[#0A0626]">{r.title}</span>
                <span className="font-mono text-[12px] text-[#6B6E75]">{r.path}</span>
              </span>
              {r.issues.length ? <span className="mt-0.5 block text-[#9A5B00]">{r.issues.join(" · ")}</span> : <span className="mt-0.5 block text-[#0F6B3A]">Looks good</span>}
            </li>
          ))}
      </ul>
      <p className="mt-3 text-[12px] text-[#6B6E75]">Page titles and descriptions live in the website's code (frontend/src/seo/routes.json); pages and posts you make here have their own boxes.</p>
    </Card>
  );
}

export default function GoogleAdmin({ me, out }) {
  const [data, reload] = useResource("/admin/settings", out);
  const [g, setG] = useState(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (data) setG({ ...DEFAULT, ...(data.google || {}) });
  }, [data]);
  if (!g) return <Empty>Loading...</Empty>;

  const site = window.location.origin;
  const set = (patch) => {
    setG({ ...g, ...patch });
    setDirty(true);
  };
  const save = async () => {
    if (await act(() => api("/admin/settings/google", { method: "PUT", body: { value: g } }), "Saved.")) {
      setDirty(false);
      reload();
    }
  };
  const indexNow = async () => {
    const r = await act(() => api("/admin/seo/indexnow", { method: "POST" }));
    if (r) toast.success(`Sent ${r.count} pages to Bing and the other IndexNow search engines.`);
  };
  const report = (i, patch) => set({ reports: g.reports.map((r, k) => (k === i ? { ...r, ...patch } : r)) });
  const canPages = me.isOwner || me.permissions.includes("pages");

  return (
    <>
      <PageTitle
        title="Google & SEO"
        desc="Google Analytics shows who visits; Google Search Console shows how the site does in Google search: the words people find you with, your position and clicks. Both are free, and Google's own."
        actions={
          <Button disabled={!dirty} onClick={save}>
            {dirty ? "Save" : "Saved"}
          </Button>
        }
      />

      <div className="space-y-6">
        <Card title="Google Analytics">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <Field label="Measurement ID" hint="Looks like G-ABC123XYZ. Leave empty to switch Google Analytics off.">
                <input value={g.gaId} maxLength={24} placeholder="G-..." onChange={(e) => set({ gaId: e.target.value.trim().toUpperCase() })} className={`${INPUT} font-mono`} />
              </Field>
              <p className={`mt-3 text-[13px] ${g.gaId ? "text-[#0F6B3A]" : "text-[#6B6E75]"}`}>
                {g.gaId ? `On: visitors who allow analytics cookies are counted under ${g.gaId}.` : "Off."} Visitors who decline analytics cookies are never sent to Google.
              </p>
              <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline">
                Open Google Analytics <ExternalLink size={13} />
              </a>
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#0A0626]">Set it up (once)</p>
              <Steps
                items={[
                  "Go to analytics.google.com and sign in with the company Google account.",
                  "Admin → Create → Property. Name it Cube Software, India time zone, Indian rupee.",
                  `Choose Web, enter ${site} as the website, and create the stream.`,
                  "Copy the Measurement ID (G-...), paste it here and press Save.",
                  "Visits start showing in Google Analytics within a few minutes (Reports → Realtime).",
                ]}
              />
            </div>
          </div>
        </Card>

        <Card title="Google Search Console (search rankings)">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <Field label="Ownership file name" hint="The file name Search Console gives you, e.g. google1a2b3c4d5e6f7a8b.html. The website then answers Google's check by itself.">
                <input value={g.searchConsole} maxLength={60} placeholder="google....html" onChange={(e) => set({ searchConsole: e.target.value.trim().toLowerCase() })} className={`${INPUT} font-mono`} />
              </Field>
              <p className="mt-3 text-[13px] text-[#404348]">
                Your sitemap, for step 5: <span className="select-all font-mono text-[12px]">{site}/sitemap.xml</span>
              </p>
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline">
                Open Search Console <ExternalLink size={13} />
              </a>
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#0A0626]">Set it up (once)</p>
              <Steps
                items={[
                  "Go to search.google.com/search-console and sign in with the company Google account.",
                  `Add property → URL prefix → ${site}`,
                  "Choose “HTML file”. Copy only the file's name (google....html), paste it here and press Save.",
                  "Back in Search Console press Verify.",
                  "Open Sitemaps, enter sitemap.xml and submit. New pages and blog posts are added to it automatically.",
                  "After a few days, Performance shows your search words, average position, impressions and clicks.",
                ]}
              />
              <p className="mt-2 text-[12px] text-[#6B6E75]">When the site moves to cube-software.com, add that address as a new property the same way.</p>
            </div>
          </div>
        </Card>

        <Card title="Bing Webmaster Tools (Bing, Yahoo, DuckDuckGo, ChatGPT search)">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <Field label="Bing verification code" hint="From Bing's “HTML Meta Tag” option: paste the tag or just its content code. The website then carries the tag and also answers Bing's BingSiteAuth.xml check.">
                <input value={g.bing} maxLength={200} placeholder="e.g. 1A2B3C4D5E6F..." onChange={(e) => set({ bing: codeOf(e.target.value) })} className={`${INPUT} font-mono`} />
              </Field>
              <Field label="Google verification code (alternative to the file)" hint="If you chose Search Console's “HTML tag” method instead: paste the tag or its content code." className="mt-4">
                <input value={g.googleMeta} maxLength={200} onChange={(e) => set({ googleMeta: codeOf(e.target.value) })} className={`${INPUT} font-mono`} />
              </Field>
              <div className="mt-4 rounded-xl bg-[#F5F8FD] p-4">
                <p className="text-[13px] font-medium text-[#0A0626]">Tell Bing and others about every page now (IndexNow)</p>
                <p className="mt-1 text-[13px] text-[#404348]">Sends the sitemap's pages to Bing, Yandex, Naver, Seznam and other IndexNow search engines, so new pages and posts are found within hours. Free, no account needed. Use it after publishing.</p>
                <Button variant="ghost" className="mt-3" onClick={indexNow}>
                  Send all pages now
                </Button>
              </div>
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#0A0626]">Set it up (once)</p>
              <Steps
                items={[
                  "Go to bing.com/webmasters and sign in (a Microsoft, Google or Facebook account).",
                  "Easiest: choose “Import from Google Search Console” once Search Console is verified. Bing copies the site and its sitemap. Done.",
                  `Or add the site by hand: enter ${site}, choose “HTML Meta Tag”, paste the tag above and press Save here, then Verify in Bing.`,
                  `Then open Sitemaps in Bing and submit ${site}/sitemap.xml.`,
                ]}
              />
            </div>
          </div>
        </Card>

        <Card
          title="Reports in this dashboard"
          actions={
            <Button variant="ghost" disabled={g.reports.length >= 4} onClick={() => set({ reports: [...g.reports, { name: "", url: "" }] })}>
              <Plus size={15} /> Add a report
            </Button>
          }
        >
          <p className="text-[13px] text-[#404348]">Show your Google Analytics and Search Console numbers right here, with a free Looker Studio report:</p>
          <Steps
            items={[
              "Go to lookerstudio.google.com and create a blank report.",
              "Add data: “Google Analytics” (pick the Cube property) and, in another report or page, “Search Console” (pick the site, Site Impression).",
              "Add charts: users, sessions and top pages; search queries, average position and clicks.",
              "File → Embed report → tick “Enable embedding”, copy the link and paste it below.",
              "Keep the report shared only with your team: it then shows here for anyone signed in to Google with access.",
            ]}
          />
          {g.reports.length > 0 && (
            <ul className="mt-4 space-y-3">
              {g.reports.map((r, i) => (
                <li key={i} className="grid gap-2 rounded-xl border border-[#E5EAF4] p-3 md:grid-cols-[1fr_2fr_auto]">
                  <input placeholder="Name, e.g. Visitors" value={r.name} maxLength={60} onChange={(e) => report(i, { name: e.target.value })} className={INPUT} aria-label="Report name" />
                  <input placeholder="https://lookerstudio.google.com/embed/reporting/..." value={r.url} maxLength={300} onChange={(e) => report(i, { url: e.target.value.trim() })} className={`${INPUT} font-mono text-[12px]`} aria-label="Report link" />
                  <Button variant="danger" className="px-2" onClick={() => set({ reports: g.reports.filter((_, k) => k !== i) })} aria-label="Remove report">
                    <Trash2 size={14} />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {data?.google?.reports?.filter((r) => LOOKER.test(r.url)).map((r) => (
          <Card key={r.url} title={r.name} actions={<a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline">Open in Looker Studio <ExternalLink size={13} /></a>}>
            <iframe title={r.name} src={embedUrl(r.url)} className="h-[720px] w-full rounded-lg border-0" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation" referrerPolicy="strict-origin-when-cross-origin" />
          </Card>
        ))}

        <SeoCheck canPages={canPages} out={out} />

        <Card title="What lifts a site in Google">
          <p className="text-[13px] text-[#6B6E75]">No tool can promise the top spot. These are what Google rewards, and what this site already does or you can do:</p>
          <ul className="mt-3 space-y-1.5 text-[13px] leading-6 text-[#404348]">
            <li>✓ Fast, mobile-friendly pages on https, a sitemap and robots.txt: done.</li>
            <li>✓ A clear title and description for every page: see the SEO check above.</li>
            <li>• Post on the blog regularly, about questions your customers really ask. Each post joins the sitemap by itself.</li>
            <li>• Link between pages: from a blog post to the product it's about, and back.</li>
            <li>• Create a free Google Business Profile for the Noida office, with this site's address, so you show up in local and Maps results.</li>
            <li>• Ask partners and customers to link to cube-software.com.</li>
            <li>• Watch Search Console's Performance report every month: rewrite the titles of pages that show often but get few clicks.</li>
          </ul>
        </Card>

        <div className="sticky bottom-3 z-10 flex items-center justify-end gap-3 rounded-2xl border border-[#E5EAF4] bg-white p-3 shadow-[0_12px_30px_-18px_rgb(10_6_38/0.4)]">
          <span className={`text-[13px] ${dirty ? "text-[#9A5B00]" : "text-[#0F6B3A]"}`}>{dirty ? "You have unsaved changes" : "Everything is saved"}</span>
          <Button disabled={!dirty} onClick={save}>
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
