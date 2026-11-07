// Search engines get a real title, description, canonical link and social tags in the HTML for every page
// (the React app keeps them in sync after that), plus sitemap.xml and robots.txt.
const fs = require("node:fs");
const path = require("node:path");
const config = require("./config");
const settings = require("./settings");
const { esc } = require("./mail");

const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cube Software Pvt. Ltd.",
  url: config.siteUrl,
  logo: `${config.siteUrl}/icon-512.png`,
  email: "sales@cube-software.com",
  contactPoint: [{ "@type": "ContactPoint", telephone: "+91-80-6869-4440", contactType: "sales", areaServed: "IN" }],
};

const routes = () => {
  try {
    return JSON.parse(fs.readFileSync(config.seoRoutesFile, "utf8"));
  } catch {
    return {};
  }
};

// The built page. On Vercel the build renames index.html to app.html, so that every page (the home page too)
// comes here for its own title and description instead of being served as the bare file. If the file wasn't
// bundled with the function, it is fetched once from the site's own static files.
let template = null;
async function indexHtml(origin) {
  if (template && config.production) return template;
  for (const name of ["app.html", "index.html"]) {
    try {
      return (template = fs.readFileSync(path.join(config.buildDir, name), "utf8"));
    } catch {
      /* try the next one */
    }
  }
  const res = await fetch(`${origin}/app.html`);
  if (!res.ok) throw new Error(`page template unavailable (${res.status})`);
  return (template = await res.text());
}

// Ownership tags for Google Search Console and Bing Webmaster Tools, when their codes are set in the dashboard.
async function verificationTags(db) {
  const g = (await settings.get(db, "google")) || {};
  return [g.googleMeta ? `<meta name="google-site-verification" content="${esc(g.googleMeta)}" />` : "", g.bing ? `<meta name="msvalidate.01" content="${esc(g.bing)}" />` : ""].filter(Boolean).join("\n    ");
}

// JSON inside <script> must not be able to close the tag.
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

// Returns { status, html } for a page path. Unknown paths get a 404 with noindex.
async function render(db, pathname, origin = config.siteUrl) {
  const all = routes();
  const clean = pathname.replace(/\/+$/, "") || "/";
  let meta = all[clean];
  let extra = "";
  let status = 200;
  const blog = /^\/blog\/([a-z0-9-]{1,80})$/.exec(clean);
  if (!meta && !blog && /^\/[a-z0-9/-]{1,120}$/.test(clean)) {
    const page = await db.get("SELECT title, description FROM pages WHERE path = ? AND published", clean);
    if (page) meta = { title: page.title, description: page.description };
  }
  if (!meta && blog) {
    const post = await db.get("SELECT slug, title, excerpt, cover, created_at, updated_at FROM posts WHERE slug = ? AND published", blog[1]);
    if (post) {
      meta = { title: `${post.title} | Cube Software Blog`, description: post.excerpt, image: post.cover };
      extra = jsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.created_at,
        dateModified: post.updated_at,
        author: { "@type": "Organization", name: "Cube Software" },
        publisher: { "@type": "Organization", name: "Cube Software Pvt. Ltd.", logo: { "@type": "ImageObject", url: `${config.siteUrl}/logo75.png` } },
        mainEntityOfPage: `${config.siteUrl}${clean}`,
      });
    }
  }
  const noindex = !meta || meta.noindex || clean.startsWith("/admin") || clean === "/demo/confirmed";
  if (!meta) {
    status = clean.startsWith("/admin") ? 200 : 404;
    meta = { title: "Cube Software", description: all["/"]?.description || "" };
  }
  const url = `${config.siteUrl}${meta.canonical || clean}`;
  const image = meta.image ? (meta.image.startsWith("http") ? meta.image : `${config.siteUrl}${meta.image}`) : `${config.siteUrl}/logo75.png`;
  const head = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    noindex ? `<meta name="robots" content="noindex, nofollow" />` : `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${blog ? "article" : "website"}" />`,
    `<meta property="og:site_name" content="Cube Software" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    clean === "/" ? jsonLd({ ...ORG, contactPoint: [{ ...ORG.contactPoint[0], telephone: await settings.editedPhone(db, ORG.contactPoint[0].telephone) }] }) : "",
    extra,
    await verificationTags(db),
  ].join("\n    ");
  const html = (await indexHtml(origin))
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta name="description"[^>]*>/, "")
    .replace("</head>", () => `    ${head}\n  </head>`); // a function, so "$&" in a title stays literal
  return { status, html };
}

// Every page search engines should know about: the site's own pages, published blog posts and dashboard pages.
async function siteUrls(db) {
  const off = (await settings.get(db, "pagesOff"))?.paths || [];
  const urls = Object.entries(routes())
    .filter(([p, m]) => !m.canonical && !m.noindex && !off.includes(p))
    .map(([p]) => ({ loc: `${config.siteUrl}${p}` }));
  for (const p of await db.all("SELECT slug, updated_at FROM posts WHERE published")) {
    urls.push({ loc: `${config.siteUrl}/blog/${p.slug}`, lastmod: p.updated_at.slice(0, 10) });
  }
  for (const p of await db.all("SELECT path, updated_at FROM pages WHERE published")) {
    if (!off.includes(p.path)) urls.push({ loc: `${config.siteUrl}${p.path}`, lastmod: p.updated_at.slice(0, 10) });
  }
  return urls;
}

async function sitemap(db) {
  const urls = await siteUrls(db);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
}

const robots = () => `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${config.siteUrl}/sitemap.xml
`;

module.exports = { render, sitemap, siteUrls, robots, routes };
