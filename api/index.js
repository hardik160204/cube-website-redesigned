// The Express API as a single Vercel Function. vercel.json rewrites every path that isn't a built file here
// (the API, pages, sitemap.xml, robots.txt), and Express routes on the original URL. A catch-all filename
// (api/[...path].js) looked tidier but only matched one path segment, so /api/admin/login 404ed.
// Files of the React build (scripts, images) come straight from Vercel's CDN; pages come here for their SEO tags.
// Locally nothing uses this file — `npm start` in server/ runs the same app via server/src/index.js.
const { open } = require("../server/src/db");
const { createApp } = require("../server/src/app");

// One database pool and one Express app per warm instance, shared by the requests it handles.
let ready;

module.exports = async (req, res) => {
  try {
    ready ||= open().then(createApp);
    return (await ready)(req, res);
  } catch (e) {
    // A failed start-up (bad DATABASE_URL, database asleep) must not poison the instance: forget it so the
    // next request retries instead of every later request failing too.
    ready = undefined;
    console.error("[api] start-up failed:", e.message, "| path:", req.url);
    // Pages still open without the database: the plain app from the CDN, which loads its data once the API is back.
    const host = String(req.headers.host || "");
    if (req.method === "GET" && !req.url.startsWith("/api") && /^[a-z0-9.-]+(:\d+)?$/i.test(host)) {
      try {
        const page = await fetch(`https://${host}/app.html`);
        if (page.ok) {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          return res.status(200).send(await page.text());
        }
      } catch {
        /* fall through to the error below */
      }
    }
    return res.status(503).json({ error: "The server is starting up. Please try again in a moment." });
  }
};
