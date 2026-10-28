// The Express API as a single Vercel Function. The file name is Vercel's catch-all convention, so every
// /api/... path reaches this one function with its original URL intact — no rewrite rules involved, which
// is what makes Express's own routing (including /api/admin/login) work. vercel.json additionally points
// /sitemap.xml and /robots.txt here; the React build is served straight from Vercel's CDN.
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
    console.error("[api] start-up failed:", e.message);
    return res.status(503).json({ error: "The server is starting up. Please try again in a moment." });
  }
};
