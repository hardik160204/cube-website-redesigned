// Search engines get a real title, description, canonical link and social tags in the HTML for every page
// (the React app keeps them in sync after that), plus sitemap.xml and robots.txt.
const fs = require("node:fs");
const path = require("node:path");
const config = require("./config");
const { esc } = require("./mail");

const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cube Software Pvt. Ltd.",
  url: config.siteUrl,
  logo: `${config.siteUrl}/logo75.png`,
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

let template = null;
const indexHtml = () => {
  if (!template || !config.production) template = fs.readFileSync(path.join(config.buildDir, "index.html"), "utf8");
  return template;
};

// JSON inside <script> must not be able to close the tag.
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

// Returns { status, html } for a page path. Unknown paths get a 404 with noindex.
async function render(db, pathname) {
  const all = routes();
  const clean = pathname.replace(/\/+$/, "") || "/";
  let meta = all[clean];
  let extra = "";
  let status = 200;
  const blog = /^\/blog\/([a-z0-9-]{1,80})$/.exec(clean);
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
  const noindex = !meta || clean.startsWith("/admin") || clean === "/demo/confirmed";
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
    clean === "/" ? jsonLd(ORG) : "",
    extra,
  ].join("\n    ");
  const html = indexHtml()
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta name="description"[^>]*>/, "")
    .replace("</head>", () => `    ${head}\n  </head>`); // a function, so "$&" in a title stays literal
  return { status, html };
}

async function sitemap(db) {
  const urls = Object.entries(routes())
    .filter(([, m]) => !m.canonical)
    .map(([p]) => ({ loc: `${config.siteUrl}${p}` }));
  for (const p of await db.all("SELECT slug, updated_at FROM posts WHERE published")) {
    urls.push({ loc: `${config.siteUrl}/blog/${p.slug}`, lastmod: p.updated_at.slice(0, 10) });
  }
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

module.exports = { render, sitemap, robots };
