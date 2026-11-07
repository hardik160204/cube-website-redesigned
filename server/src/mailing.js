// Emails to visitors: demo confirmations (sent when the team confirms a booking in the dashboard) and newsletters.
// Every one comes from the address set in the dashboard (Emails → Sender, info@cube-software.com unless changed),
// and carries an unsubscribe link. Unsubscribing stops newsletters at once; the team then approves removing the
// person's details. Only people who asked for news on a form, or whom an admin added with their agreement, get them.
const crypto = require("node:crypto");
const config = require("./config");
const settings = require("./settings");
const { esc, ics, send, when } = require("./mail");
const { EMAIL } = require("./validate");

const ADDRESS = "Cube Software Pvt. Ltd., A-26, Ground Floor, Sector 63, Noida, Uttar Pradesh 201301, India";
const DEFAULT_SENDER = { name: "Cube Software", bookings: "info@cube-software.com", promotions: "info@cube-software.com" };
const sender = async (db) => ({ ...DEFAULT_SENDER, ...((await settings.get(db, "emailSender")) || {}) });
// Display names can't break out of the From header.
const from = (s, which) => `"${String(s.name).replace(/["\\\r\n]/g, "")}" <${s[which]}>`;

// --- Unsubscribe links: the address plus a signature only this server can make, so nobody can unsubscribe others.
const norm = (e) => String(e || "").trim().toLowerCase();
const signature = (email) => crypto.createHmac("sha256", config.appSecret).update(`unsubscribe:${norm(email)}`).digest("base64url").slice(0, 32);
const query = (email) => `e=${Buffer.from(norm(email)).toString("base64url")}&t=${signature(email)}`;
const unsubscribeUrl = (email) => `${config.siteUrl}/unsubscribe?${query(email)}`;
// The address from a link, or null if the link wasn't made here.
function fromLink(e, t) {
  const email = Buffer.from(String(e || ""), "base64url").toString("utf8");
  if (!EMAIL.test(email) || typeof t !== "string") return null;
  const want = Buffer.from(signature(email));
  const got = Buffer.from(t);
  return got.length === want.length && crypto.timingSafeEqual(got, want) ? norm(email) : null;
}
// Gmail and Yahoo show their own "Unsubscribe" button from these, which posts to the link directly (RFC 8058).
const unsubscribeHeaders = (email) => ({ "List-Unsubscribe": `<${config.siteUrl}/api/unsubscribe?${query(email)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" });

const hash = (email) => crypto.createHash("sha256").update(norm(email)).digest("hex");
const suppressed = async (db, email) => Boolean(await db.get("SELECT 1 FROM email_suppressions WHERE email_hash = ?", hash(email)));

// Someone who ticked "send me product news" on a form (or was added in the dashboard with their agreement).
async function subscribe(db, { email, name = "", company = "", source }) {
  if (await suppressed(db, email)) return false;
  await db.run(
    `INSERT INTO contacts (email, name, company, source, subscribed, consent_at) VALUES (?, ?, ?, ?, true, now())
     ON CONFLICT ((lower(email))) DO UPDATE SET subscribed = true, consent_at = now(), unsubscribed_at = NULL,
       name = CASE WHEN excluded.name <> '' THEN excluded.name ELSE contacts.name END,
       company = CASE WHEN excluded.company <> '' THEN excluded.company ELSE contacts.company END`,
    norm(email), name, company, source
  );
  return true;
}

// Stops newsletters at once and tells the sales team. Returns false if they were already unsubscribed.
async function unsubscribe(db, email) {
  const row = await db.get("SELECT subscribed FROM contacts WHERE lower(email) = ?", norm(email));
  if (row && !row.subscribed) return false;
  if (row) await db.run("UPDATE contacts SET subscribed = false, unsubscribed_at = now() WHERE lower(email) = ?", norm(email));
  else if (!(await suppressed(db, email))) await db.run("INSERT INTO contacts (email, source, subscribed, unsubscribed_at) VALUES (?, 'unsubscribe link', false, now())", norm(email));
  else return false;
  const team = await settings.get(db, "salesEmails");
  await send({
    to: team.join(","),
    subject: `Unsubscribed: ${norm(email)}`,
    html: `<p style="font:14px Arial,sans-serif">${esc(norm(email))} unsubscribed from Cube Software emails. They won't get newsletters any more. Approve removing their details in the dashboard: Emails → Unsubscribed.</p>`,
  }).catch((e) => console.error("[mail] unsubscribe notice", e.message));
  return true;
}

// --- The email layout: logo, content, and the footer with the address and the unsubscribe link -----------------
const P = "font:15px/1.6 Arial,sans-serif;color:#31343A;margin:0 0 14px";
const absolute = (url) => (/^https:\/\//.test(url) ? url : `${config.siteUrl}${url.startsWith("/") ? "" : "/"}${url}`);
function layout(inner, email) {
  return `<!doctype html><html><body style="margin:0;background:#F3F6FB">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F6FB"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:14px">
<tr><td style="padding:24px 28px 8px"><img src="${config.siteUrl}/logo-nav.png" width="160" alt="Cube Software" style="display:block;border:0;height:auto"></td></tr>
<tr><td style="padding:12px 28px 24px">${inner}</td></tr></table>
<p style="font:12px/1.6 Arial,sans-serif;color:#6B6E75;max-width:600px;margin:16px auto 0">${esc(ADDRESS)}<br>
You're getting this email from Cube Software. <a href="${esc(unsubscribeUrl(email))}" style="color:#0047FF">Unsubscribe</a> from our emails.</p>
</td></tr></table></body></html>`;
}
const paragraphs = (text) =>
  String(text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="${P}">${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
const button = (label, href) =>
  `<p style="margin:22px 0 6px"><a href="${esc(href)}" style="display:inline-block;background:#0047FF;color:#FFFFFF;font:600 15px Arial,sans-serif;text-decoration:none;padding:12px 22px;border-radius:9px">${esc(label)}</a></p>`;

// --- Demo confirmations ---------------------------------------------------------------------------------------
// What the visitor gets when the team confirms (with a calendar invite) or declines their requested time.
async function bookingEmail(db, b, confirmed) {
  const s = await sender(db);
  const phone = await settings.editedPhone(db, "+91 80 68 69 44 40");
  const local = when(b.slot_start, b.timezone);
  const inner = confirmed
    ? `<h1 style="font:600 22px Arial,sans-serif;color:#0A0626;margin:0 0 16px">Your demo is confirmed</h1>
<p style="${P}">Hi ${esc(b.name)},</p>
<p style="${P}">Thank you for booking a demo with Cube Software. We've confirmed your session on <b>${esc(local)}</b> (${esc(b.timezone)}).</p>
<p style="${P}">The calendar invite is attached. Our team will send you the meeting link before the call. Need a different time? Reply to this email or call ${esc(phone)}.</p>
<p style="${P}">— Team Cube Software</p>`
    : `<h1 style="font:600 22px Arial,sans-serif;color:#0A0626;margin:0 0 16px">About your demo request</h1>
<p style="${P}">Hi ${esc(b.name)},</p>
<p style="${P}">Thank you for your interest in Cube Software. Unfortunately we can't hold the time you asked for (${esc(local)}).</p>
<p style="${P}">Please pick another time that suits you, or reply to this email and we'll find one together.</p>
${button("Choose another time", `${config.siteUrl}/demo`)}
<p style="${P}">— Team Cube Software</p>`;
  return {
    from: from(s, "bookings"),
    to: b.email,
    subject: confirmed ? "Your Cube Software demo is confirmed" : "About your Cube Software demo request",
    html: layout(inner, b.email),
    headers: unsubscribeHeaders(b.email),
  };
}

// Sends the visitor's email, and on confirmation puts the demo in the sales team's calendars.
async function sendBookingDecision(db, b, confirmed) {
  const message = await bookingEmail(db, b, confirmed);
  const team = await settings.get(db, "salesEmails");
  if (!confirmed) return send(message);
  const demo = await settings.get(db, "demo");
  const invite = ics({
    id: b.id,
    start: b.slot_start,
    minutes: demo.slotMinutes,
    summary: "Cube Software product demo",
    description: `Demo with ${b.name} (${b.company}). Phone ${b.phone}. Email ${b.email}.`,
    organizer: (await sender(db)).bookings,
  });
  await send({ ...message, icalEvent: { method: "REQUEST", content: invite } });
  await send({
    to: team.join(","),
    replyTo: b.email,
    subject: `Demo confirmed: ${b.company} — ${when(b.slot_start, "Asia/Kolkata")}`,
    html: `<p style="font:14px Arial,sans-serif">The demo with ${esc(b.name)} (${esc(b.company)}) is confirmed and ${esc(b.email)} has been emailed. The calendar invite is attached.</p>`,
    icalEvent: { method: "REQUEST", content: invite },
  });
}

// --- Newsletters ---------------------------------------------------------------------------------------------
function campaignEmail(s, c, email) {
  const k = c.content || {};
  const inner = [
    k.heading ? `<h1 style="font:600 24px Arial,sans-serif;color:#0A0626;margin:0 0 16px">${esc(k.heading)}</h1>` : "",
    k.image ? `<img src="${esc(absolute(k.image))}" alt="${esc(k.imageAlt || "")}" width="544" style="display:block;width:100%;max-width:544px;height:auto;border:0;border-radius:10px;margin:0 0 18px">` : "",
    paragraphs(k.body),
    k.buttonLabel && k.buttonUrl ? button(k.buttonLabel, absolute(k.buttonUrl)) : "",
  ].join("");
  return { from: from(s, "promotions"), to: email, subject: c.subject, html: layout(inner, email), headers: unsubscribeHeaders(email) };
}

module.exports = { DEFAULT_SENDER, sender, fromLink, unsubscribeUrl, subscribe, unsubscribe, suppressed, hash, norm, bookingEmail, sendBookingDecision, campaignEmail };
