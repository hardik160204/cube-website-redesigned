// The whole site from one process: the API, uploaded images, the built React app, and server-rendered
// SEO tags for every page. Security headers (CSP, HSTS, no framing, nosniff) come from helmet.
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("node:path");
const config = require("./config");
const seo = require("./seo");
const settings = require("./settings");
const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");

function createApp(db) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);
  // Uploaded files live in Supabase Storage: the browser uploads to it directly and plays videos from it.
  const storage = config.supabase.url ? [new URL(config.supabase.url).origin] : [];

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          // Google Analytics, when it is switched on in the dashboard and the visitor allowed it.
          scriptSrc: ["'self'", "https://www.googletagmanager.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          mediaSrc: ["'self'", ...storage],
          connectSrc: ["'self'", ...storage, "https://*.google-analytics.com", "https://*.analytics.google.com", "https://*.googletagmanager.com"],
          frameSrc: ["'self'", "https://maps.google.com", "https://www.google.com", "https://lookerstudio.google.com"],
          frameAncestors: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          ...(config.production ? { upgradeInsecureRequests: [] } : {}),
        },
      },
      strictTransportSecurity: config.production ? { maxAge: 31536000, includeSubDomains: true } : false,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    })
  );
  app.use((req, res, next) => {
    res.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
    next();
  });
  app.use(compression());

  // Signed-in admins save whole pages and card lists; everything public stays small.
  app.use("/api/admin", express.json({ limit: "300kb" }));
  app.use("/api", express.json({ limit: "20kb" }));

  // Serverless has no long-running timer, so the daily deletion sweep is triggered by Vercel Cron, which
  // sends CRON_SECRET as a bearer token. On a normal server the timer in retention.js does this instead.
  app.get("/api/cron/retention", async (req, res) => {
    if (!config.cronSecret || req.get("authorization") !== `Bearer ${config.cronSecret}`) return res.status(401).json({ error: "Unauthorized." });
    res.json({ deleted: await require("./retention").sweep(db) });
  });

  // Both spellings: the plain paths a crawler asks for, and the /api/... ones Vercel's rewrite may pass on.
  // Registered before the /api catch-all below, which would otherwise answer them with a 404.
  app.get(["/robots.txt", "/api/robots.txt"], (req, res) => res.type("text/plain").send(seo.robots()));
  app.get(["/sitemap.xml", "/api/sitemap.xml"], async (req, res) => res.type("application/xml").send(await seo.sitemap(db)));

  // Google Search Console's ownership check: answers only for the file named in the dashboard (Google & SEO).
  app.get(/^\/(?:api\/)?(google[a-z0-9]{6,40}\.html)$/, async (req, res, next) => {
    const file = req.params[0];
    if ((await settings.get(db, "google"))?.searchConsole !== file) return next();
    res.type("text/html").set("Cache-Control", "no-cache").send(`google-site-verification: ${file}`);
  });

  // Bing Webmaster Tools' ownership file, and the IndexNow key file (lets Bing and others accept our list of pages).
  app.get(["/BingSiteAuth.xml", "/api/BingSiteAuth.xml"], async (req, res, next) => {
    const code = (await settings.get(db, "google"))?.bing;
    if (!code) return next();
    res.type("application/xml").set("Cache-Control", "no-cache").send(`<?xml version="1.0"?>\n<users>\n\t<user>${code}</user>\n</users>\n`);
  });
  app.get(/^\/(?:api\/)?([a-f0-9]{32})\.txt$/, async (req, res, next) => {
    if ((await settings.get(db, "indexNowKey")) !== req.params[0]) return next();
    res.type("text/plain").send(req.params[0]);
  });

  app.use("/api/admin", adminRoutes(db));
  app.use("/api", publicRoutes(db));
  app.use("/api", (req, res) => res.status(404).json({ error: "Not found." }));

  app.use(
    express.static(config.buildDir, {
      index: false,
      dotfiles: "ignore",
      setHeaders: (res, file) => {
        // Hashed bundles never change; everything else is revalidated.
        res.set("Cache-Control", file.includes(`${path.sep}static${path.sep}`) ? "public, max-age=31536000, immutable" : "public, max-age=3600");
      },
    })
  );

  // Every other GET is a page of the React app.
  app.use(async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (path.extname(req.path)) return res.status(404).type("text/plain").send("Not found");
    const page = await seo.render(db, req.path, `${req.protocol}://${req.get("host")}`);
    // Pages are the same for everyone, so Vercel's edge may keep them for a few minutes (new deploys clear it).
    // The dashboard is never kept.
    const admin = req.path.startsWith("/admin");
    res.set("Cache-Control", admin ? "no-store" : page.status === 200 ? "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" : "public, max-age=0, s-maxage=60");
    // Only the real address is indexed: the same site on another address (e.g. *.vercel.app) asks not to be.
    if (config.production && req.hostname !== new URL(config.siteUrl).hostname) res.set("X-Robots-Tag", "noindex");
    res.status(page.status).type("html").send(page.html);
  });

  app.use((req, res) => res.status(404).type("text/plain").send("Not found"));

  // Errors never leak stack traces or internals to the browser.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    let status = 500;
    let message = "Something went wrong. Please try again.";
    if (err.type === "entity.parse.failed") [status, message] = [400, "Invalid request."];
    else if (err.type === "entity.too.large") [status, message] = [413, "That is too large."];
    else if (err.expose) [status, message] = [err.status, err.message];
    else console.error(`[error] ${req.method} ${req.originalUrl}`, err);
    res.status(status).json({ error: message });
  });

  return app;
}

module.exports = { createApp };
