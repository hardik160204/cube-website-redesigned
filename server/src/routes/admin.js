// Admin API behind /api/admin. Every route except login needs a valid session (requireAdmin), and every
// change also needs the X-Cube-Admin header. All input is validated here before it touches the database.
const express = require("express");
const rateLimit = require("express-rate-limit");
const crypto = require("node:crypto");
const settings = require("../settings");
const slots = require("../slots");
const sec = require("../security");
const supabase = require("../supabase");
const seo = require("../seo");
const { isUnique } = require("../db");
const { EMAIL } = require("../validate");

// 10 failed sign-in requests per IP per 15 minutes (LOGIN_RATE_LIMIT exists so the test suite can run many).
const loginLimit = rateLimit({ windowMs: 15 * 60_000, limit: Number(process.env.LOGIN_RATE_LIMIT) || 10, skipSuccessfulRequests: true, standardHeaders: "draft-7", legacyHeaders: false, message: { error: "Too many sign-in attempts. Try again in 15 minutes." } });

const ICONS = ["Workflow", "PhoneOutgoing", "Mic", "Cloud", "PhoneMissed", "Database", "Newspaper", "BarChart3", "MessageSquare", "ShieldCheck", "Headset", "Globe"];
const isStr = (v, max, min = 0) => typeof v === "string" && v.trim().length >= min && v.length <= max;
const SAFE_URL = /^(\/[A-Za-z0-9._\-/]{1,200}|https:\/\/[^\s<>"']{5,500})$/;
// A row id from the URL, or null (so "abc" or "1e9" is a 404, not a database error).
const idOf = (req) => {
  const n = Number(req.params.id);
  return Number.isInteger(n) && n > 0 && n < 2 ** 31 ? n : null;
};

// What can be uploaded, and the largest size of each (MB). Files are recognised by their first bytes, never
// by name or the browser's say-so. SVG and HTML are refused on purpose: they can carry scripts.
const TYPES = {
  jpg: { mime: "image/jpeg", max: 10 },
  png: { mime: "image/png", max: 10 },
  gif: { mime: "image/gif", max: 10 },
  webp: { mime: "image/webp", max: 10 },
  avif: { mime: "image/avif", max: 10 },
  mp4: { mime: "video/mp4", max: 50 },
  webm: { mime: "video/webm", max: 50 },
};
const MEDIA_FILE = /^[a-f0-9]{24}\.(jpg|png|gif|webp|avif|mp4|webm)$/;

function fileType(buf) {
  if (buf.length < 12) return null;
  const ascii = (a, b) => buf.subarray(a, b).toString("latin1");
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (ascii(0, 4) === "GIF8") return "gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return "webm";
  if (ascii(4, 8) === "ftyp") {
    const brand = ascii(8, 12);
    if (brand === "avif" || brand === "avis") return "avif";
    // HEIC photos and QuickTime .mov don't play in most browsers: those need converting first.
    if (/^(heic|heix|hevc|mif1|msf1|qt {2})$/.test(brand)) return null;
    return "mp4";
  }
  return null;
}

function checkPost(b) {
  if (!b || typeof b !== "object") return "Invalid request.";
  if (!isStr(b.slug, 80) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.slug)) return "Slug: lowercase letters, numbers and hyphens only.";
  if (!isStr(b.title, 160, 3)) return "Title is required (up to 160 characters).";
  if (!isStr(b.category, 40, 2)) return "Category is required.";
  if (!ICONS.includes(b.icon)) return "Choose an icon from the list.";
  if (!isStr(b.excerpt, 400, 10)) return "Excerpt is required (up to 400 characters).";
  if (b.cover && !(isStr(b.cover, 500) && SAFE_URL.test(b.cover))) return "Cover image URL is not valid.";
  if (!Array.isArray(b.body) || b.body.length === 0 || b.body.length > 60) return "Add between 1 and 60 body blocks.";
  for (const block of b.body) {
    if (typeof block === "string") {
      if (!isStr(block, 3000, 1)) return "Each paragraph must be 1 to 3000 characters.";
    } else if (block && typeof block === "object" && "h" in block) {
      if (!isStr(block.h, 160, 1)) return "Each sub-heading must be 1 to 160 characters.";
    } else if (block && Array.isArray(block.list)) {
      if (block.list.length === 0 || block.list.length > 20 || !block.list.every((li) => isStr(li, 400, 1))) return "Lists need 1 to 20 items of up to 400 characters.";
    } else return "Unknown body block.";
  }
  return null;
}

function checkSettings(key, v) {
  if (key === "salesEmails") {
    if (!Array.isArray(v) || v.length < 1 || v.length > 10 || !v.every((e) => isStr(e, 254) && EMAIL.test(e))) return "Add 1 to 10 valid email addresses.";
    return null;
  }
  if (key === "team") {
    if (!Array.isArray(v) || v.length > 30) return "Add up to 30 team members.";
    for (const m of v) {
      if (!m || typeof m !== "object") return "Invalid team member.";
      if (!isStr(m.name, 80, 1)) return "Each team member needs a name (up to 80 characters).";
      if (!isStr(m.role ?? "", 80)) return "Roles can be up to 80 characters.";
      if (!isStr(m.bio ?? "", 400)) return "Bios can be up to 400 characters.";
      if (m.image && !(isStr(m.image, 500) && SAFE_URL.test(m.image))) return `Photo for ${m.name} is not a valid image address.`;
      if (m.linkedin && !(isStr(m.linkedin, 300) && /^https:\/\/[^\s<>"']+$/.test(m.linkedin))) return `LinkedIn for ${m.name} must start with https://`;
    }
    return null;
  }
  if (key === "socials") {
    if (!v || typeof v !== "object") return "Invalid links.";
    for (const k of Object.keys(v)) {
      if (!["facebook", "linkedin", "instagram", "youtube", "x"].includes(k)) return "Unknown social network.";
      if (v[k] && !(isStr(v[k], 300) && /^https:\/\/[^\s<>"']+$/.test(v[k]))) return `The ${k} link must start with https://`;
    }
    return null;
  }
  if (key === "retention") {
    if (!v || !Number.isInteger(v.enquiryMonths) || v.enquiryMonths < 6 || v.enquiryMonths > 84) return "Keep enquiries for 6 to 84 months.";
    return null;
  }
  if (key === "demo") {
    if (!v || typeof v !== "object" || !v.hours || typeof v.hours !== "object") return "Invalid settings.";
    const time = /^([01]\d|2[0-3]):[0-5]\d$/;
    for (let d = 0; d <= 6; d++) {
      const h = v.hours?.[d];
      if (h == null) continue;
      if (!Array.isArray(h) || h.length !== 2 || !time.test(h[0]) || !time.test(h[1]) || h[0] >= h[1]) return "Opening hours must be HH:MM to HH:MM.";
    }
    if (![15, 20, 30, 45, 60].includes(v.slotMinutes)) return "Slot length must be 15, 20, 30, 45 or 60 minutes.";
    if (!Number.isInteger(v.minNoticeHours) || v.minNoticeHours < 0 || v.minNoticeHours > 72) return "Notice must be 0 to 72 hours.";
    if (!Number.isInteger(v.horizonDays) || v.horizonDays < 1 || v.horizonDays > 120) return "Booking window must be 1 to 120 days.";
    if (!Array.isArray(v.blockedDates) || v.blockedDates.length > 200 || !v.blockedDates.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))) return "Blocked dates must be YYYY-MM-DD.";
    if (!isStr(v.meetingType, 100, 2)) return "Meeting type is required.";
    return null;
  }
  return "Unknown setting.";
}

// Dashboard sections the owner can give each admin. The owner always has them all, plus the activity log
// and admin accounts; the overview and an admin's own password are open to everyone.
const SECTIONS = ["bookings", "calendar", "leads", "blog", "content", "pages", "media", "team", "analytics", "consents", "privacy", "settings"];
const may = (admin, ...any) => admin.isOwner || any.some((s) => admin.permissions.includes(s));
const need = (...any) => (req, res, next) => (may(req.admin, ...any) ? next() : res.status(403).json({ error: "You don't have access to this. Ask the owner to give it to you." }));
const ownerOnly = (req, res, next) => (req.admin.isOwner ? next() : res.status(403).json({ error: "Only the owner can see this." }));
// Anyone who edits content needs the image library to pick from.
const MEDIA_USERS = ["media", "blog", "content", "pages", "team"];
const SETTING_SECTION = { salesEmails: "settings", demo: "settings", retention: "settings", team: "team", socials: "team" };
const checkPermissions = (v) => (Array.isArray(v) && v.length <= SECTIONS.length && v.every((s) => SECTIONS.includes(s)) ? null : "Unknown section.");

// Card lists edited on the site. Each kind keeps only its own fields, so nothing unexpected is stored and
// served to visitors. Links are site paths or https addresses; pictures are site paths or uploaded files.
const ICON_NAME = /^[A-Za-z0-9]{1,40}$/;
const LINK = /^(\/[A-Za-z0-9._\-/#]{0,200}|https:\/\/[^\s<>"']{5,300})$/;
const card = (c) => c && isStr(c.title, 160, 1) && isStr(c.desc ?? "", 600) && (!c.icon || ICON_NAME.test(c.icon));
const keep = (o, keys) => Object.fromEntries(keys.map((k) => [k, typeof o[k] === "string" ? o[k].trim() : ""]));
const LIST_KINDS = {
  features: { max: 24, ok: card, clean: (c) => keep(c, ["icon", "title", "desc"]) },
  steps: { max: 12, ok: card, clean: (c) => keep(c, ["icon", "title", "desc"]) },
  checklist: { max: 40, ok: (s) => isStr(s, 300, 1), clean: (s) => s.trim() },
  tiles: { max: 40, ok: (s) => isStr(s, 160, 1), clean: (s) => s.trim() },
  faq: { max: 40, ok: (f) => f && isStr(f.q, 300, 1) && isStr(f.a, 2000, 1), clean: (f) => keep(f, ["q", "a"]) },
  products: {
    max: 40,
    ok: (p) => p && isStr(p.title, 120, 1) && isStr(p.tag ?? "", 40) && isStr(p.tagline ?? "", 300) && (!p.img || (isStr(p.img, 500) && SAFE_URL.test(p.img))) && isStr(p.href, 300) && LINK.test(p.href),
    clean: (p) => keep(p, ["title", "tag", "tagline", "img", "href"]),
  },
};
const LIST_KEY = /^(features|steps|checklist|tiles|faq|products):[a-z0-9]{1,16}$/;
const SCOPE = /^\/[A-Za-z0-9/_\-]*$/;

// Pages built in the dashboard. Addresses are lowercase words and hyphens, up to three levels deep, and
// can't take over the admin, the API, the blog or any page the site already has.
const PAGE_PATH = /^\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*){0,2}$/;
const paragraphs = (v, max = 12) => v === undefined || (Array.isArray(v) && v.length <= max && v.every((p) => isStr(p, 3000, 1)));
const lines = (v) => v === undefined || (Array.isArray(v) && v.length <= 30 && v.every((p) => isStr(p, 300, 1)));
const picture = (v) => !v || (isStr(v, 500) && SAFE_URL.test(v));

function checkPage(b) {
  if (!b || typeof b !== "object") return "Invalid request.";
  if (!isStr(b.path, 120) || !PAGE_PATH.test(b.path)) return "Address: start with / and use lowercase letters, numbers and hyphens (e.g. /services/co-browsing).";
  if (/^\/(admin|api|blog|static)(\/|$)/.test(b.path) || seo.routes()[b.path]) return "That address is already used by the website. Pick another.";
  if (!isStr(b.title, 120, 3)) return "Browser-tab title is required (up to 120 characters).";
  if (!isStr(b.description ?? "", 300)) return "Search description can be up to 300 characters.";
  const c = b.content;
  if (!c || typeof c !== "object" || !c.hero || typeof c.hero !== "object") return "The page needs a top section.";
  const h = c.hero;
  if (!isStr(h.title, 160, 1)) return "The top section needs a headline.";
  if (!isStr(h.label ?? "", 60) || !isStr(h.button ?? "", 60) || !paragraphs(h.body, 4) || !lines(h.list) || !picture(h.image)) return "Check the top section's fields.";
  if (!Array.isArray(c.sections) || c.sections.length > 20) return "Add up to 20 sections.";
  for (const [i, s] of c.sections.entries()) {
    const at = `Section ${i + 1}`;
    if (!s || typeof s !== "object") return `${at} is not valid.`;
    if (!isStr(s.label ?? "", 60) || !isStr(s.title ?? "", 160) || !isStr(s.button ?? "", 60)) return `${at}: label up to 60, heading up to 160, button up to 60 characters.`;
    if (!paragraphs(s.body) || !lines(s.list) || !picture(s.image)) return `${at}: check its text, list and picture.`;
    if (s.cards !== undefined && !(Array.isArray(s.cards) && s.cards.length <= 24 && s.cards.every(card))) return `${at}: each card needs a title (up to 160) and text up to 600 characters.`;
    if (!s.title && !s.body?.length && !s.list?.length && !s.cards?.length && !s.image) return `${at} is empty.`;
  }
  if (c.cta && !(isStr(c.cta.title ?? "", 160) && paragraphs(c.cta.body, 3) && isStr(c.cta.button ?? "", 60))) return "Check the closing call to action.";
  return null;
}

// Stores only the fields the page template uses.
function cleanPage(c) {
  const text = (v) => (typeof v === "string" ? v.trim() : "");
  const arr = (v) => (Array.isArray(v) ? v.map((x) => x.trim()) : []);
  return {
    hero: { label: text(c.hero.label), title: text(c.hero.title), body: arr(c.hero.body), list: arr(c.hero.list), image: text(c.hero.image), button: text(c.hero.button) },
    sections: c.sections.map((s) => ({
      label: text(s.label),
      title: text(s.title),
      body: arr(s.body),
      list: arr(s.list),
      cards: (s.cards || []).map((x) => keep(x, ["icon", "title", "desc"])),
      steps: s.steps === true,
      image: text(s.image),
      button: text(s.button),
    })),
    cta: c.cta ? { title: text(c.cta.title), body: arr(c.cta.body), button: text(c.cta.button) } : null,
    related: c.related === true,
  };
}

module.exports = function adminRoutes(db) {
  const r = express.Router();
  const guard = sec.requireAdmin(db);
  const notFound = (res) => res.status(404).json({ error: "Not found." });
  // What the dashboard needs to know about the signed-in admin: the owner gets every section.
  const profile = (a) => ({ id: a.id, email: a.email, isOwner: a.isOwner, permissions: a.isOwner ? SECTIONS : a.permissions });

  // Nothing from the admin API is cached, and every request that changes something (sign-in included, so a
  // cross-site form can't sign someone in or out) must carry the X-Cube-Admin header.
  r.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    if (req.method !== "GET" && req.get("X-Cube-Admin") !== "1") return res.status(403).json({ error: "Forbidden." });
    next();
  });

  // --- Session -------------------------------------------------------------------------------------------
  const signedIn = async (res, result) => {
    const row = await db.get("SELECT is_owner, permissions FROM admins WHERE id = ?", result.admin.id);
    sec.clearPendingCookie(res);
    sec.setSessionCookie(res, result.session);
    res.json({ admin: profile({ ...result.admin, isOwner: row.is_owner, permissions: Array.isArray(row.permissions) ? row.permissions : [] }) });
  };

  // Step 1: email + password. Replies with the second step the client should show — "totp" (enter the code)
  // or "totp_setup" (first time: here's the QR / setup key to add to the authenticator app, then a code).
  r.post("/login", loginLimit, async (req, res) => {
    const { email, password } = req.body || {};
    if (!isStr(email, 254) || !isStr(password, 200)) return res.status(400).json({ error: "Enter your email and password." });
    const result = await sec.login(db, req, email, password);
    if (!result.ok) return res.status(401).json({ error: result.locked ? "Too many failed attempts. The account is locked for 15 minutes." : "Email or password is incorrect." });
    sec.setPendingCookie(res, result.pending);
    res.json(result.step === "totp_setup" ? { step: "totp_setup", otpauth: result.otpauth, secret: result.secret } : { step: "totp" });
  });

  // Step 2: the 6-digit code from the authenticator app (also confirms enrolment the first time).
  r.post("/login/code", loginLimit, async (req, res) => {
    const result = await sec.verifyCode(db, req, req.body?.code);
    if (result.ok) return signedIn(res, result);
    if (result.expired) sec.clearPendingCookie(res);
    res.status(401).json({ error: result.expired ? "That sign-in has expired. Please start again." : "That code is wrong. Check the latest code in your authenticator app.", restart: Boolean(result.expired) });
  });

  r.post("/logout", async (req, res) => {
    const admin = await sec.sessionAdmin(db, req);
    if (admin) {
      await db.run("DELETE FROM sessions WHERE token_hash = ?", admin.tokenHash);
      await sec.audit(db, req, "logout", { admin });
    }
    sec.clearSessionCookie(res);
    res.json({ ok: true });
  });

  r.get("/me", async (req, res) => {
    const admin = await sec.sessionAdmin(db, req);
    if (!admin) return res.status(401).json({ error: "Please sign in." });
    res.json({ admin: profile(admin) });
  });

  r.use(guard);

  // Signs this admin out on every device, this one included.
  r.post("/logout-all", async (req, res) => {
    await db.run("DELETE FROM sessions WHERE admin_id = ?", req.admin.id);
    sec.clearSessionCookie(res);
    res.json({ ok: true });
  });

  // The activity log (every sign-in and change by every admin) is for the owner's eyes only.
  r.get("/audit", ownerOnly, async (req, res) => {
    res.json({ entries: await db.all("SELECT id, at, email, action, detail, ip FROM audit_log ORDER BY id DESC LIMIT 1000") });
  });

  r.get("/stats", async (req, res) => {
    const one = async (sql, ...p) => (await db.get(sql, ...p)).n;
    res.json({
      upcoming: await one("SELECT COUNT(*)::int n FROM bookings WHERE status = 'scheduled' AND slot_start >= ?", new Date().toISOString()),
      bookings: await one("SELECT COUNT(*)::int n FROM bookings"),
      leads: await one("SELECT COUNT(*)::int n FROM leads"),
      leadsWeek: await one("SELECT COUNT(*)::int n FROM leads WHERE created_at >= now() - interval '7 days'"),
      posts: await one("SELECT COUNT(*)::int n FROM posts"),
      edits: await one("SELECT COUNT(*)::int n FROM overrides"),
      consents: await one("SELECT COUNT(*)::int n FROM consents"),
    });
  });

  // --- Demo bookings and enquiries --------------------------------------------------------------------------
  r.use("/bookings", need("bookings"));
  r.use("/leads", need("leads"));
  r.use("/posts", need("blog"));
  r.use(["/overrides", "/lists"], need("content"));
  r.use("/pages", need("pages"));
  r.use("/media", need(...MEDIA_USERS));
  r.use(["/schedule", "/slot-rules", "/days"], need("calendar"));
  r.use("/consents", need("consents"));
  r.use(["/privacy", "/retention"], need("privacy"));
  r.use("/analytics", need("analytics"));

  r.get("/bookings", async (req, res) => res.json({ bookings: await db.all("SELECT * FROM bookings ORDER BY slot_start DESC LIMIT 1000") }));

  r.patch("/bookings/:id", async (req, res) => {
    const id = idOf(req);
    const status = req.body?.status;
    if (!id) return notFound(res);
    if (!["scheduled", "completed", "cancelled"].includes(status)) return res.status(400).json({ error: "Invalid status." });
    try {
      const { changes } = await db.run("UPDATE bookings SET status = ? WHERE id = ?", status, id);
      if (!changes) return notFound(res);
    } catch (e) {
      if (isUnique(e)) return res.status(409).json({ error: "Another live booking already holds that slot." });
      throw e;
    }
    res.json({ ok: true });
  });

  r.delete("/bookings/:id", async (req, res) => {
    const id = idOf(req);
    if (!id) return notFound(res);
    await db.run("DELETE FROM bookings WHERE id = ?", id);
    res.json({ ok: true });
  });

  r.get("/leads", async (req, res) => res.json({ leads: await db.all("SELECT * FROM leads ORDER BY id DESC LIMIT 1000") }));

  r.delete("/leads/:id", async (req, res) => {
    const id = idOf(req);
    if (!id) return notFound(res);
    await db.run("DELETE FROM leads WHERE id = ?", id);
    res.json({ ok: true });
  });

  // --- Blog ---------------------------------------------------------------------------------------------
  r.get("/posts", async (req, res) => res.json({ posts: await db.all("SELECT * FROM posts ORDER BY sort, id"), icons: ICONS }));

  r.post("/posts", async (req, res) => {
    const err = checkPost(req.body);
    if (err) return res.status(400).json({ error: err });
    const b = req.body;
    try {
      const { row } = await db.run(
        `INSERT INTO posts (slug, title, category, icon, excerpt, body, cover, published, sort)
         VALUES (?, ?, ?, ?, ?, ?::jsonb, ?, ?, (SELECT COALESCE(MAX(sort), 0) + 1 FROM posts)) RETURNING id`,
        b.slug, b.title.trim(), b.category.trim(), b.icon, b.excerpt.trim(), JSON.stringify(b.body), b.cover || "", b.published !== false
      );
      res.status(201).json({ id: row.id });
    } catch (e) {
      if (isUnique(e)) return res.status(409).json({ error: "That slug is already used." });
      throw e;
    }
  });

  r.put("/posts/:id", async (req, res) => {
    const id = idOf(req);
    if (!id) return notFound(res);
    const err = checkPost(req.body);
    if (err) return res.status(400).json({ error: err });
    const b = req.body;
    try {
      const { changes } = await db.run(
        "UPDATE posts SET slug = ?, title = ?, category = ?, icon = ?, excerpt = ?, body = ?::jsonb, cover = ?, published = ?, updated_at = now() WHERE id = ?",
        b.slug, b.title.trim(), b.category.trim(), b.icon, b.excerpt.trim(), JSON.stringify(b.body), b.cover || "", b.published !== false, id
      );
      if (!changes) return notFound(res);
      res.json({ ok: true });
    } catch (e) {
      if (isUnique(e)) return res.status(409).json({ error: "That slug is already used." });
      throw e;
    }
  });

  r.delete("/posts/:id", async (req, res) => {
    const id = idOf(req);
    if (!id) return notFound(res);
    await db.run("DELETE FROM posts WHERE id = ?", id);
    res.json({ ok: true });
  });

  // --- Visual editor edits ----------------------------------------------------------------------------------
  r.get("/overrides", async (req, res) => res.json({ overrides: await db.all("SELECT * FROM overrides ORDER BY updated_at DESC") }));

  r.post("/overrides", async (req, res) => {
    const { kind, scope, original, replacement } = req.body || {};
    // The size of the spot an image fills (CSS px), so the replacement keeps that shape.
    const size = (v) => (Number.isInteger(v) && v > 0 && v <= 10000 ? v : 0);
    const [width, height] = kind === "image" ? [size(req.body.width), size(req.body.height)] : [0, 0];
    if (!["text", "image"].includes(kind)) return res.status(400).json({ error: "Invalid kind." });
    if (!(scope === "*" || (isStr(scope, 100) && /^\/[A-Za-z0-9/_\-]*$/.test(scope)))) return res.status(400).json({ error: "Invalid page." });
    if (!isStr(original, 2000, 1)) return res.status(400).json({ error: "Original is required." });
    if (kind === "text" && !isStr(replacement, 5000)) return res.status(400).json({ error: "Text is too long." });
    if (kind === "image" && !(replacement === "" || (isStr(replacement, 500) && SAFE_URL.test(replacement)))) return res.status(400).json({ error: "Image URL is not valid." });
    await db.run(
      `INSERT INTO overrides (kind, scope, original, replacement, width, height) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT (kind, scope, original) DO UPDATE SET replacement = excluded.replacement, width = excluded.width, height = excluded.height, updated_at = now()`,
      kind, scope, original, replacement, width, height
    );
    res.json({ ok: true });
  });

  r.delete("/overrides/:id", async (req, res) => {
    const id = idOf(req);
    if (!id) return notFound(res);
    await db.run("DELETE FROM overrides WHERE id = ?", id);
    res.json({ ok: true });
  });

  // Whole card lists (add, remove, reorder, rewrite cards), saved for one page or every page.
  r.get("/lists", async (req, res) => res.json({ lists: await db.all("SELECT * FROM lists ORDER BY updated_at DESC") }));

  r.put("/lists", async (req, res) => {
    const { scope, key, items } = req.body || {};
    if (!(scope === "*" || (isStr(scope, 100) && SCOPE.test(scope)))) return res.status(400).json({ error: "Invalid page." });
    if (!isStr(key, 40) || !LIST_KEY.test(key)) return res.status(400).json({ error: "Invalid list." });
    const kind = LIST_KINDS[key.split(":")[0]];
    if (!Array.isArray(items) || items.length > kind.max) return res.status(400).json({ error: `Up to ${kind.max} items.` });
    const bad = items.findIndex((it) => !kind.ok(it));
    if (bad >= 0) return res.status(400).json({ error: `Item ${bad + 1}: fill in the required fields (links start with / or https://).` });
    await db.run(
      "INSERT INTO lists (scope, key, items) VALUES (?, ?, ?::jsonb) ON CONFLICT (scope, key) DO UPDATE SET items = excluded.items, updated_at = now()",
      scope, key, JSON.stringify(items.map(kind.clean))
    );
    res.json({ ok: true });
  });

  r.delete("/lists/:id", async (req, res) => {
    const id = idOf(req);
    if (!id) return notFound(res);
    await db.run("DELETE FROM lists WHERE id = ?", id);
    res.json({ ok: true });
  });

  // --- Pages built in the dashboard ------------------------------------------------------------------------
  r.get("/pages", async (req, res) => res.json({ pages: await db.all("SELECT * FROM pages ORDER BY path") }));

  const savePage = async (req, res, id) => {
    const err = checkPage(req.body);
    if (err) return res.status(400).json({ error: err });
    const b = req.body;
    const values = [b.path, b.title.trim(), (b.description || "").trim(), b.published === true, JSON.stringify(cleanPage(b.content))];
    try {
      if (!id) return res.status(201).json({ id: (await db.run("INSERT INTO pages (path, title, description, published, content) VALUES (?, ?, ?, ?, ?::jsonb) RETURNING id", ...values)).row.id });
      const { changes } = await db.run("UPDATE pages SET path = ?, title = ?, description = ?, published = ?, content = ?::jsonb, updated_at = now() WHERE id = ?", ...values, id);
      return changes ? res.json({ ok: true }) : notFound(res);
    } catch (e) {
      if (isUnique(e)) return res.status(409).json({ error: "Another page already uses that address." });
      throw e;
    }
  };
  r.post("/pages", (req, res) => savePage(req, res, null));
  r.put("/pages/:id", (req, res) => (idOf(req) ? savePage(req, res, idOf(req)) : notFound(res)));
  r.delete("/pages/:id", async (req, res) => {
    const id = idOf(req);
    if (!id) return notFound(res);
    await db.run("DELETE FROM pages WHERE id = ?", id);
    res.json({ ok: true });
  });

  // --- Media library (files in the Supabase Storage "media" bucket) ----------------------------------------------
  r.get("/media", async (req, res) => res.json({ media: (await db.all("SELECT * FROM media ORDER BY id DESC")).map((m) => ({ ...m, url: supabase.publicUrl(m.file) })) }));

  // Uploads go straight from the browser to Storage in two steps. 1) Ask for a one-file upload link,
  // saying what kind of file it is and how big. 2) After the upload, confirm: the server reads the file's
  // first bytes and keeps it only if it really is that kind of file; anything else is deleted.
  r.post("/media/sign", async (req, res) => {
    const { type, size } = req.body || {};
    const ext = Object.keys(TYPES).find((k) => TYPES[k].mime === type);
    if (!ext) return res.status(400).json({ error: "Upload JPG, PNG, WebP, AVIF or GIF images, or MP4 or WebM video. SVG and other files aren't allowed." });
    if (!Number.isInteger(size) || size < 1 || size > TYPES[ext].max * 1024 * 1024) return res.status(400).json({ error: `That file is too big: ${ext.toUpperCase()} files can be up to ${TYPES[ext].max} MB.` });
    const file = `${crypto.randomBytes(12).toString("hex")}.${ext}`;
    res.json({ file, mime: TYPES[ext].mime, uploadUrl: await supabase.signUpload(file) });
  });

  r.post("/media/confirm", async (req, res) => {
    const file = req.body?.file;
    if (typeof file !== "string" || !MEDIA_FILE.test(file)) return res.status(400).json({ error: "Invalid file." });
    if (await db.get("SELECT 1 FROM media WHERE file = ?", file)) return res.status(409).json({ error: "Already added." });
    const head = await supabase.readStart(file);
    if (!head) return res.status(400).json({ error: "The upload didn't arrive. Please try again." });
    const ext = file.split(".").pop();
    if (fileType(head.buf) !== ext || head.size > TYPES[ext].max * 1024 * 1024) {
      await supabase.remove(file).catch(() => {});
      return res.status(400).json({ error: `That file isn't a real ${ext.toUpperCase()} file (or is too big), so it was removed.` });
    }
    const name = String(req.body.name || "file").replace(/[^\w.\- ]/g, "").slice(0, 120) || "file";
    try {
      const { row } = await db.run("INSERT INTO media (file, original_name, mime, size) VALUES (?, ?, ?, ?) RETURNING id", file, name, TYPES[ext].mime, head.size);
      res.status(201).json({ id: row.id, url: supabase.publicUrl(file), mime: TYPES[ext].mime });
    } catch (e) {
      await supabase.remove(file).catch(() => {});
      throw e;
    }
  });

  r.delete("/media/:id", async (req, res) => {
    const id = idOf(req);
    const m = id && (await db.get("SELECT file FROM media WHERE id = ?", id));
    if (!m) return notFound(res);
    // The stored name is ours (random hex + extension), so it can only point at its own object.
    if (MEDIA_FILE.test(m.file)) await supabase.remove(m.file);
    await db.run("DELETE FROM media WHERE id = ?", id);
    res.json({ ok: true });
  });

  // --- Demo calendar: per-day slots, block / reopen / add a slot, close a whole day -----------------------
  r.get("/schedule", async (req, res) => {
    const from = /^\d{4}-\d{2}-\d{2}$/.test(String(req.query.from)) ? String(req.query.from) : slots.istDate(Date.now());
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 1, 1), 42);
    const demo = await settings.get(db, "demo");
    const bookings = new Map((await db.all("SELECT id, slot_start, name, company FROM bookings WHERE status <> 'cancelled'")).map((b) => [b.slot_start, b]));
    const rules = new Map((await db.all("SELECT slot_start, action FROM slot_rules")).map((x) => [x.slot_start, x.action]));
    const start = Date.parse(`${from}T00:00:00Z`);
    const out = [];
    for (let i = 0; i < days; i++) out.push(slots.daySchedule(new Date(start + i * 86_400_000).toISOString().slice(0, 10), demo, bookings, Date.now(), rules));
    res.json({ days: out, minNoticeHours: demo.minNoticeHours, slotMinutes: demo.slotMinutes });
  });

  // action "block" closes a slot, "open" adds (or reopens) one, null removes the rule (back to weekly hours).
  r.put("/slot-rules", async (req, res) => {
    const { start, action } = req.body || {};
    if (typeof start !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/.test(start) || Number.isNaN(Date.parse(start))) return res.status(400).json({ error: "Invalid time." });
    if (Date.parse(start) % (5 * 60_000) !== 0) return res.status(400).json({ error: "Times must be on a 5-minute mark." });
    if (action === null) {
      await db.run("DELETE FROM slot_rules WHERE slot_start = ?", start);
      return res.json({ ok: true });
    }
    if (!["block", "open"].includes(action)) return res.status(400).json({ error: "Invalid action." });
    if (action === "open" && Date.parse(start) < Date.now()) return res.status(400).json({ error: "That time has already passed." });
    await db.run(
      "INSERT INTO slot_rules (slot_start, action) VALUES (?, ?) ON CONFLICT (slot_start) DO UPDATE SET action = excluded.action, updated_at = now()",
      start, action
    );
    res.json({ ok: true });
  });

  r.put("/days/:date", async (req, res) => {
    const date = req.params.date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) return res.status(400).json({ error: "Invalid date." });
    const demo = await settings.get(db, "demo");
    const rest = demo.blockedDates.filter((d) => d !== date);
    const blockedDates = req.body?.closed === true ? [...rest, date].sort() : rest;
    if (blockedDates.length > 200) return res.status(400).json({ error: "Too many closed dates. Reopen some old ones first." });
    await settings.set(db, "demo", { ...demo, blockedDates });
    res.json({ ok: true });
  });

  // --- Consent records (cookie choices; Terms & Privacy agreement is stored on each booking and enquiry) ----
  r.get("/consents", async (req, res) => {
    const totals = await db.get(
      "SELECT COUNT(*)::int total, COUNT(*) FILTER (WHERE functional)::int functional, COUNT(*) FILTER (WHERE updated_at >= now() - interval '30 days')::int last30 FROM consents"
    );
    const forms = await db.get(
      "SELECT (SELECT COUNT(*)::int FROM bookings) bookings, (SELECT COUNT(*)::int FROM leads) leads"
    );
    const records = await db.all("SELECT id, functional, analytics, marketing, version, created_at, updated_at FROM consents ORDER BY updated_at DESC LIMIT 1000");
    res.json({ totals, forms, records });
  });

  // --- Privacy requests: everything held about one email address, to export or erase (DPDP/PDPL rights) --
  const personEmail = (v) => (isStr(v, 254) && EMAIL.test(v.trim()) ? v.trim() : null);

  r.get("/privacy", async (req, res) => {
    const email = personEmail(req.query.email);
    if (!email) return res.status(400).json({ error: "Enter a valid email address." });
    res.json({
      email,
      bookings: await db.all("SELECT * FROM bookings WHERE lower(email) = lower(?) ORDER BY id", email),
      leads: await db.all("SELECT * FROM leads WHERE lower(email) = lower(?) ORDER BY id", email),
    });
  });

  r.post("/privacy/erase", async (req, res) => {
    const email = personEmail(req.body?.email);
    if (!email) return res.status(400).json({ error: "Enter a valid email address." });
    const bookings = (await db.run("DELETE FROM bookings WHERE lower(email) = lower(?)", email)).changes;
    const leads = (await db.run("DELETE FROM leads WHERE lower(email) = lower(?)", email)).changes;
    // The log keeps that an erasure happened, not whose data it was.
    await sec.audit(db, req, "privacy_erase", { admin: req.admin, detail: `erased ${bookings} bookings and ${leads} enquiries for ${sec.sha256(email.toLowerCase()).slice(0, 12)}` });
    res.json({ ok: true, bookings, leads });
  });

  r.post("/retention/run", async (req, res) => res.json({ deleted: await require("../retention").sweep(db) }));

  // --- Analytics (only visitors who allowed it) ---------------------------------------------------------
  r.get("/analytics", async (req, res) => {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 395);
    const since = "at >= now() - make_interval(days => ?)";
    const top = (col) => db.all(`SELECT ${col} AS label, COUNT(*)::int n FROM page_views WHERE ${since} AND ${col} <> '' GROUP BY 1 ORDER BY 2 DESC LIMIT 10`, days);
    res.json({
      days,
      total: (await db.get(`SELECT COUNT(*)::int n FROM page_views WHERE ${since}`, days)).n,
      byDay: await db.all(`SELECT to_char(at AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day, COUNT(*)::int n FROM page_views WHERE ${since} GROUP BY 1 ORDER BY 1`, days),
      pages: await top("path"),
      referrers: await top("referrer"),
      devices: await top("device"),
      browsers: await top("browser"),
      systems: await top("os"),
    });
  });

  // --- Settings -----------------------------------------------------------------------------------------
  // Only the settings this admin's sections cover.
  r.get("/settings", async (req, res) => {
    const out = {};
    for (const [key, section] of Object.entries(SETTING_SECTION)) if (may(req.admin, section)) out[key] = (await settings.get(db, key)) ?? null;
    res.json(out);
  });

  r.put("/settings/:key", async (req, res) => {
    const key = req.params.key;
    if (SETTING_SECTION[key] && !may(req.admin, SETTING_SECTION[key])) return res.status(403).json({ error: "You don't have access to this. Ask the owner to give it to you." });
    const err = checkSettings(key, req.body?.value);
    if (err) return res.status(400).json({ error: err });
    let value = req.body.value;
    // Keep only the known fields, so nothing unexpected is stored and served on the public site.
    if (key === "team") value = value.map((m) => ({ name: m.name.trim(), role: m.role || "", image: m.image || "", bio: m.bio || "", linkedin: m.linkedin || "" }));
    if (key === "socials") value = Object.fromEntries(["facebook", "linkedin", "instagram", "youtube", "x"].map((k) => [k, value[k] || ""]));
    await settings.set(db, key, value);
    res.json({ ok: true });
  });

  // --- Admin accounts (passwords live in Supabase Auth; authenticator secrets are our own) ------------------
  // The owner sees every admin and what each may open; everyone else sees only their own account.
  r.get("/admins", async (req, res) => {
    const rows = await db.all("SELECT id, email, is_owner, permissions, (totp_secret IS NOT NULL) AS has_authenticator, created_at FROM admins ORDER BY id");
    res.json({ admins: req.admin.isOwner ? rows : rows.filter((a) => a.id === req.admin.id) });
  });

  // The owner chooses which sections another admin can open (and so see the data of).
  r.put("/admins/:id/permissions", async (req, res) => {
    if (!req.admin.isOwner) return res.status(403).json({ error: "Only the owner can change what admins can see." });
    const id = idOf(req);
    if (!id) return notFound(res);
    const err = checkPermissions(req.body?.permissions);
    if (err) return res.status(400).json({ error: err });
    const row = await db.get("SELECT email, is_owner FROM admins WHERE id = ?", id);
    if (!row) return notFound(res);
    if (row.is_owner) return res.status(400).json({ error: "The owner always sees everything." });
    await db.run("UPDATE admins SET permissions = ?::jsonb WHERE id = ?", JSON.stringify([...new Set(req.body.permissions)]), id);
    await sec.audit(db, req, "permissions_changed", { admin: req.admin, detail: `${row.email}: ${req.body.permissions.join(", ") || "nothing"}` });
    res.json({ ok: true });
  });

  // Owner resets another admin's authenticator (e.g. they lost their phone): clears it so that admin sets up
  // a new one on their next sign-in. An admin can also reset their own.
  r.post("/admins/:id/reset-authenticator", async (req, res) => {
    const id = idOf(req);
    if (!id) return notFound(res);
    if (id !== req.admin.id && !req.admin.isOwner) return res.status(403).json({ error: "Only the owner can reset another admin's authenticator." });
    const row = await db.get("SELECT email FROM admins WHERE id = ?", id);
    if (!row) return notFound(res);
    await db.run("UPDATE admins SET totp_secret = NULL WHERE id = ?", id);
    await db.run("DELETE FROM sessions WHERE admin_id = ?", id); // sign them out so they re-enrol
    await sec.audit(db, req, "authenticator_reset", { admin: req.admin, detail: `for ${row.email}` });
    res.json({ ok: true });
  });

  // Only the owner (the first admin) adds or removes admins, and the owner can never be removed.
  r.post("/admins", async (req, res) => {
    if (!req.admin.isOwner) return res.status(403).json({ error: "Only the owner can add admins." });
    const { email, password, permissions = [] } = req.body || {};
    if (!isStr(email, 254) || !EMAIL.test(email)) return res.status(400).json({ error: "Enter a valid email." });
    if (!sec.strongPassword(password)) return res.status(400).json({ error: "Password needs 12+ characters with letters and numbers." });
    if (checkPermissions(permissions)) return res.status(400).json({ error: "Unknown section." });
    if (await db.get("SELECT 1 FROM admins WHERE lower(email) = lower(?)", email)) return res.status(409).json({ error: "That admin already exists." });
    const authId = await supabase.upsertUser(email.trim(), password);
    try {
      await db.run("INSERT INTO admins (email, auth_user_id, permissions) VALUES (?, ?, ?::jsonb)", email.trim(), authId, JSON.stringify([...new Set(permissions)]));
    } catch (e) {
      if (isUnique(e)) return res.status(409).json({ error: "That admin already exists." });
      throw e;
    }
    res.status(201).json({ ok: true });
  });

  r.delete("/admins/:id", async (req, res) => {
    if (!req.admin.isOwner) return res.status(403).json({ error: "Only the owner can remove admins." });
    const id = idOf(req);
    if (!id) return notFound(res);
    if (id === req.admin.id) return res.status(400).json({ error: "You cannot remove your own account." });
    const row = await db.get("SELECT auth_user_id, is_owner FROM admins WHERE id = ?", id);
    if (!row) return notFound(res);
    if (row.is_owner) return res.status(400).json({ error: "The owner can't be removed." });
    await db.run("DELETE FROM admins WHERE id = ?", id);
    await supabase.deleteUser(row.auth_user_id);
    res.json({ ok: true });
  });

  r.post("/password", async (req, res) => {
    const { current, next } = req.body || {};
    if (!isStr(current, 200) || (await supabase.signIn(req.admin.email, current)) !== req.admin.authUserId) return res.status(400).json({ error: "Current password is incorrect." });
    if (!sec.strongPassword(next)) return res.status(400).json({ error: "New password needs 12+ characters with letters and numbers." });
    await supabase.setPassword(req.admin.authUserId, next);
    // Sign out every other session for this account.
    await db.run("DELETE FROM sessions WHERE admin_id = ? AND token_hash <> ?", req.admin.id, req.admin.tokenHash);
    res.json({ ok: true });
  });

  return r;
};
