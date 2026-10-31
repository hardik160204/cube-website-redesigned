// Public API used by the website: demo availability and booking, enquiries, cookie-consent records, the
// visual editor's content edits and the blog. Form posts are rate-limited per IP and carry a honeypot field.
const express = require("express");
const rateLimit = require("express-rate-limit");
const crypto = require("node:crypto");
const config = require("../config");
const settings = require("../settings");
const slots = require("../slots");
const mail = require("../mail");
const { isUnique } = require("../db");
const { check, LEAD_RULES, BOOKING_RULES } = require("../validate");

const formLimit = rateLimit({ windowMs: 60 * 60_000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false, message: { error: "Too many requests. Please try again later." } });
const consentLimit = rateLimit({ windowMs: 60 * 60_000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false });
const viewLimit = rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: "draft-7", legacyHeaders: false });
const readLimit = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: "draft-7", legacyHeaders: false });

const rulesMap = async (db) => new Map((await db.all("SELECT slot_start, action FROM slot_rules")).map((r) => [r.slot_start, r.action]));
const bookedSet = async (db) => new Set((await db.all("SELECT slot_start FROM bookings WHERE status <> 'cancelled'")).map((r) => r.slot_start));
const today = () => new Date().toISOString().slice(0, 10);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// Bots fill every field; people never see this one.
const isBot = (body) => body && typeof body.company_website === "string" && body.company_website.length > 0;

module.exports = function publicRoutes(db) {
  const r = express.Router();
  r.use(readLimit);

  r.get("/demo-info", async (req, res) => {
    const demo = await settings.get(db, "demo");
    res.json({ slotMinutes: demo.slotMinutes, meetingType: demo.meetingType, horizonDays: demo.horizonDays });
  });

  r.get("/availability", async (req, res) => {
    const from = /^\d{4}-\d{2}-\d{2}$/.test(String(req.query.from)) ? String(req.query.from) : today();
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 31, 1), 62);
    const demo = await settings.get(db, "demo");
    res.set("Cache-Control", "no-store").json({ slots: slots.availability(from, days, demo, await bookedSet(db), Date.now(), await rulesMap(db)) });
  });

  r.post("/bookings", formLimit, async (req, res) => {
    if (isBot(req.body)) return res.json({ ok: true });
    if (req.body?.consent !== true) return res.status(400).json({ error: "Please accept the Terms & Conditions and Privacy Policy." });
    const { data, error } = check(req.body, BOOKING_RULES);
    if (error) return res.status(400).json({ error });
    try {
      new Intl.DateTimeFormat("en", { timeZone: data.timezone });
    } catch {
      return res.status(400).json({ error: "Time zone is not valid." });
    }
    const demo = await settings.get(db, "demo");
    if (!slots.isBookable(data.slot, demo, await bookedSet(db), Date.now(), await rulesMap(db))) {
      return res.status(409).json({ error: "That time was just taken. Please pick another slot." });
    }
    let booking;
    try {
      booking = (
        await db.run(
          `INSERT INTO bookings (slot_start, timezone, name, email, phone, company, designation, users, interest, message, consent_at, terms_version)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), ?) RETURNING *`,
          data.slot, data.timezone, data.name, data.email, data.phone, data.company, data.designation, data.users, data.interest, data.message, config.termsVersion
        )
      ).row;
    } catch (e) {
      // The unique index stops two people booking the same slot at the same moment.
      if (isUnique(e)) return res.status(409).json({ error: "That time was just taken. Please pick another slot." });
      throw e;
    }
    mail.bookingEmails(booking, await settings.get(db, "salesEmails"), demo).catch((e) => console.error("[mail] booking", booking.id, e.message));
    res.status(201).json({ ok: true, id: booking.id });
  });

  r.post("/leads", formLimit, async (req, res) => {
    if (isBot(req.body)) return res.json({ ok: true });
    if (req.body?.consent !== true) return res.status(400).json({ error: "Please accept the Terms & Conditions and Privacy Policy." });
    const { data, error } = check(req.body, LEAD_RULES);
    if (error) return res.status(400).json({ error });
    const source = ["contact", "chat", "other"].includes(req.body.source) ? req.body.source : "contact";
    const { row } = await db.run(
      `INSERT INTO leads (name, email, phone, company, designation, website, interest, users, message, source, consent_at, terms_version)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), ?) RETURNING id`,
      data.name, data.email, data.phone, data.company, data.designation, data.website, data.interest, data.users, data.message, source, config.termsVersion
    );
    mail.leadEmail({ ...data, source }, await settings.get(db, "salesEmails")).catch((e) => console.error("[mail] lead", row.id, e.message));
    res.status(201).json({ ok: true });
  });

  // Consent receipts: which optional cookie categories a browser agreed to, and when (DPDP Act record-keeping).
  r.post("/consents", consentLimit, async (req, res) => {
    const b = req.body || {};
    const id = typeof b.id === "string" && UUID.test(b.id) ? b.id : crypto.randomUUID();
    const version = typeof b.version === "string" && b.version.length <= 20 ? b.version : "1";
    await db.run(
      `INSERT INTO consents (id, functional, analytics, marketing, version) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET functional = excluded.functional, analytics = excluded.analytics, marketing = excluded.marketing,
         version = excluded.version, updated_at = now()`,
      id, b.functional === true, b.analytics === true, b.marketing === true, version
    );
    res.json({ ok: true, id });
  });

  // A page view, sent by the browser only when the visitor allowed analytics. Only the page, the referring
  // site and a rough device description are stored: no IP address, cookie, visitor id or full user agent.
  r.post("/pv", viewLimit, async (req, res) => {
    const path = typeof req.body?.path === "string" ? req.body.path : "";
    if (!/^\/[A-Za-z0-9/_\-]{0,150}$/.test(path) || path.startsWith("/admin")) return res.status(204).end();
    const ref = typeof req.body?.ref === "string" && /^[a-z0-9.-]{1,100}$/i.test(req.body.ref) ? req.body.ref.toLowerCase() : "";
    const ua = String(req.get("user-agent") || "");
    if (/bot|crawl|spider|slurp|headless|lighthouse/i.test(ua)) return res.status(204).end();
    const device = /ipad|tablet/i.test(ua) ? "Tablet" : /mobi|android|iphone/i.test(ua) ? "Mobile" : "Desktop";
    const browser = /edg\//i.test(ua) ? "Edge" : /opr\/|opera/i.test(ua) ? "Opera" : /chrome|crios/i.test(ua) ? "Chrome" : /firefox|fxios/i.test(ua) ? "Firefox" : /safari/i.test(ua) ? "Safari" : "Other";
    const os = /windows/i.test(ua) ? "Windows" : /iphone|ipad|ios/i.test(ua) ? "iOS" : /android/i.test(ua) ? "Android" : /mac os/i.test(ua) ? "macOS" : /linux/i.test(ua) ? "Linux" : "Other";
    const lang = (String(req.get("accept-language") || "").match(/^[a-z]{2,3}(-[A-Za-z]{2})?/) || [""])[0];
    await db.run("INSERT INTO page_views (path, referrer, device, browser, os, lang) VALUES (?, ?, ?, ?, ?, ?)", path, ref, device, browser, os, lang);
    res.status(204).end();
  });

  // Team cards and footer social links set in the admin (null = the site's built-in defaults).
  r.get("/site", async (req, res) => {
    res.set("Cache-Control", "no-cache").json({ team: (await settings.get(db, "team")) ?? null, socials: (await settings.get(db, "socials")) ?? null });
  });

  r.get("/content", async (req, res) => {
    const rows = await db.all("SELECT kind, scope, original, replacement, width, height FROM overrides");
    const lists = await db.all("SELECT scope, key, items FROM lists");
    res.set("Cache-Control", "no-cache").json({ overrides: rows, lists });
  });

  // A page built in the dashboard, once it's published.
  r.get("/page", async (req, res) => {
    const path = String(req.query.path || "");
    const page = /^\/[a-z0-9/-]{1,120}$/.test(path) && (await db.get("SELECT path, title, description, content FROM pages WHERE path = ? AND published", path));
    if (!page) return res.status(404).json({ error: "Not found." });
    res.set("Cache-Control", "no-cache").json({ page });
  });

  r.get("/posts", async (req, res) => {
    const posts = await db.all("SELECT slug, title, category, icon, excerpt, body, cover, published FROM posts WHERE published ORDER BY sort, id");
    res.json({ posts });
  });

  r.get("/posts/:slug", async (req, res) => {
    const post = await db.get("SELECT slug, title, category, icon, excerpt, body, cover, published FROM posts WHERE slug = ? AND published", String(req.params.slug));
    if (!post) return res.status(404).json({ error: "Not found." });
    res.json({ post });
  });

  return r;
};
