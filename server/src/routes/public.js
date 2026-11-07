// Public API used by the website: demo availability and booking, enquiries, cookie-consent records, the
// visual editor's content edits and the blog. Form posts are rate-limited per IP and carry a honeypot field.
const express = require("express");
const { limit } = require("../limits");
const crypto = require("node:crypto");
const config = require("../config");
const settings = require("../settings");
const slots = require("../slots");
const mail = require("../mail");
const mailing = require("../mailing");
const { isUnique } = require("../db");
const { check, EMAIL, LEAD_RULES, BOOKING_RULES } = require("../validate");

const formLimit = limit("form", { windowMs: 60 * 60_000, limit: 20, message: { error: "Too many requests. Please try again later." } });
const consentLimit = limit("consent", { windowMs: 60 * 60_000, limit: 30 });
const viewLimit = limit("view", { windowMs: 60_000, limit: 60 });
const readLimit = limit("read", { windowMs: 60_000, limit: 120 });

const rulesMap = async (db) => new Map((await db.all("SELECT slot_start, action FROM slot_rules")).map((r) => [r.slot_start, r.action]));
const bookedSet = async (db) => new Set((await db.all("SELECT slot_start FROM bookings WHERE status <> 'cancelled'")).map((r) => r.slot_start));
const today = () => new Date().toISOString().slice(0, 10);
// Of the Google settings, visitors' browsers only need the Analytics ID; reports and the rest stay in the dashboard.
const gaOnly = (g) => (g?.gaId ? { gaId: g.gaId } : null);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// Bots fill every field; people never see this one.
// Emails to the team wait for the send (a serverless function may stop once it has answered), but never longer
// than a few seconds: the visitor's booking or enquiry is already saved.
const notify = (what, id, sending) =>
  Promise.race([sending, new Promise((r) => setTimeout(r, 8000))]).catch((e) => console.error(`[mail] ${what}`, id, e.message));
// "Send me product news" on a form (optional, unticked by default) adds them to the newsletter list.
const wantsNews = (db, body, data, source) =>
  body?.marketing === true ? mailing.subscribe(db, { email: data.email, name: data.name, company: data.company || "", source }).catch((e) => console.error("[contacts]", e.message)) : null;
// Which Terms and Privacy Policy someone agreed to: the dates on the pages as edited in the dashboard (or built in).
const policyVersion = async (db) => {
  const legal = (await settings.get(db, "legal")) || {};
  return `Terms ${legal.terms?.updated || config.termsDate} / Privacy ${legal.privacy?.updated || config.privacyDate}`.slice(0, 120);
};
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
          `INSERT INTO bookings (slot_start, timezone, name, email, phone, company, designation, users, interest, message, consent_at, terms_version, status, marketing)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), ?, 'pending', ?) RETURNING *`,
          data.slot, data.timezone, data.name, data.email, data.phone, data.company, data.designation, data.users, data.interest, data.message, await policyVersion(db), req.body.marketing === true
        )
      ).row;
    } catch (e) {
      // The unique index stops two people booking the same slot at the same moment.
      if (isUnique(e)) return res.status(409).json({ error: "That time was just taken. Please pick another slot." });
      throw e;
    }
    // The team confirms or declines it in the dashboard; only then is the visitor emailed.
    await wantsNews(db, req.body, data, "demo booking");
    await notify("booking", booking.id, mail.bookingRequestEmail(booking, await settings.get(db, "salesEmails")));
    res.status(201).json({ ok: true, id: booking.id });
  });

  r.post("/leads", formLimit, async (req, res) => {
    if (isBot(req.body)) return res.json({ ok: true });
    if (req.body?.consent !== true) return res.status(400).json({ error: "Please accept the Terms & Conditions and Privacy Policy." });
    const { data, error } = check(req.body, LEAD_RULES);
    if (error) return res.status(400).json({ error });
    const source = ["contact", "chat", "other"].includes(req.body.source) ? req.body.source : "contact";
    const { row } = await db.run(
      `INSERT INTO leads (name, email, phone, company, designation, website, interest, users, message, source, consent_at, terms_version, marketing)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), ?, ?) RETURNING id`,
      data.name, data.email, data.phone, data.company, data.designation, data.website, data.interest, data.users, data.message, source, await policyVersion(db), req.body.marketing === true
    );
    await wantsNews(db, req.body, data, "enquiry");
    await notify("lead", row.id, mail.leadEmail({ ...data, source }, await settings.get(db, "salesEmails")));
    res.status(201).json({ ok: true });
  });

  // Unsubscribe links in our emails. The page asks first (link checkers open links on their own); mail apps'
  // own unsubscribe button posts here directly with the address in the link (RFC 8058 one-click).
  r.post("/unsubscribe", consentLimit, async (req, res) => {
    const email = mailing.fromLink(req.body?.e ?? req.query.e, req.body?.t ?? req.query.t);
    if (!email) return res.status(400).json({ error: "This unsubscribe link isn't valid. Reply to any of our emails and we'll take you off the list." });
    await mailing.unsubscribe(db, email);
    res.json({ ok: true, email });
  });

  // The data deletion form (Privacy Policy, Data deletion page). The team checks who is asking and then erases
  // their data in the dashboard (Privacy requests).
  r.post("/deletion-requests", formLimit, async (req, res) => {
    if (isBot(req.body)) return res.json({ ok: true });
    const email = String(req.body?.email || "").trim();
    const name = String(req.body?.name || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 120);
    const details = String(req.body?.details || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, "").trim().slice(0, 2000);
    if (!EMAIL.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
    const { row } = await db.run("INSERT INTO deletion_requests (email, name, details) VALUES (?, ?, ?) RETURNING id", email, name, details);
    await notify(
      "deletion request",
      row.id,
      mail.send({
        to: (await settings.get(db, "salesEmails")).join(","),
        subject: `Data deletion request from ${email}`,
        html: `<p style="font:14px Arial,sans-serif">${mail.esc(name || email)} asked for their personal data to be deleted. Check it's really them, then carry it out in the dashboard: Privacy requests.</p>${mail.table([["Email", email], ["Name", name], ["Details", details]])}`,
      })
    );
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
    // The IP address and its city and country only when switched on in the dashboard and this visitor allowed it
    // after being told (ip: true). The place comes from Vercel's own lookup, so nothing is sent anywhere else.
    const details = req.body?.ip === true && (await settings.get(db, "visitorTracking"))?.on;
    const place = (h) => {
      try {
        return decodeURIComponent(String(req.get(h) || "")).replace(/[^\p{L}\p{N} .,'()-]/gu, "").slice(0, 80);
      } catch {
        return "";
      }
    };
    await db.run(
      "INSERT INTO page_views (path, referrer, device, browser, os, lang, ip, city, region, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      path, ref, device, browser, os, lang,
      details ? String(req.ip || "").slice(0, 45) : "",
      details ? place("x-vercel-ip-city") : "",
      details ? place("x-vercel-ip-country-region") : "",
      details ? place("x-vercel-ip-country") : ""
    );
    res.status(204).end();
  });

  // Team cards, footer social links and the navigation bar set in the admin (null = the site's built-in defaults).
  r.get("/site", async (req, res) => {
    res.set("Cache-Control", "no-cache").json({ team: (await settings.get(db, "team")) ?? null, socials: (await settings.get(db, "socials")) ?? null, nav: (await settings.get(db, "nav")) ?? null, bot: (await settings.get(db, "bot")) ?? null, fonts: (await settings.get(db, "fonts")) ?? null, festival: (await settings.get(db, "festival")) ?? null, pagesOff: (await settings.get(db, "pagesOff")) ?? null, sectionsOff: (await settings.get(db, "sectionsOff")) ?? null, pricing: (await settings.get(db, "pricing")) ?? null, google: gaOnly(await settings.get(db, "google")), tracking: Boolean((await settings.get(db, "visitorTracking"))?.on) });
  });

  // A legal page as edited in the dashboard (null = the built-in text).
  r.get("/legal/:page", async (req, res) => {
    if (!["privacy", "terms", "refund"].includes(req.params.page)) return res.status(404).json({ error: "Not found." });
    res.set("Cache-Control", "no-cache").json({ doc: (await settings.get(db, "legal"))?.[req.params.page] ?? null });
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
