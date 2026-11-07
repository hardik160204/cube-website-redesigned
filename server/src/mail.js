// Sending email, and the emails to the sales team (every demo request and enquiry). Emails to visitors are in mailing.js.
// Without SMTP settings (local development) messages are printed to the console instead of sent.
const nodemailer = require("nodemailer");
const config = require("./config");

// Ready to send only with a host and, when a user is given, its password. Until then (e.g. the password
// hasn't been pasted into .env yet) messages are printed to the console instead of half-configured and failing.
const smtpReady = config.smtp.host && (config.smtp.pass || !config.smtp.user);
const transport = smtpReady
  ? nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      requireTLS: !config.smtp.secure, // Microsoft 365 and most providers: STARTTLS on port 587
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
    })
  : null;

// Everything a visitor typed is escaped before it goes into an HTML email.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const when = (iso, timeZone) =>
  new Intl.DateTimeFormat("en-IN", { timeZone, dateStyle: "full", timeStyle: "short" }).format(new Date(iso));

function table(rows) {
  return `<table cellpadding="6" style="border-collapse:collapse;font:14px Arial,sans-serif">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="color:#6B6E75;vertical-align:top">${esc(k)}</td><td style="color:#0A0626"><b>${esc(v)}</b></td></tr>`)
    .join("")}</table>`;
}

// A calendar invite the recipient can add with one click.
function ics({ id, start, minutes, summary, description, organizer }) {
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const s = new Date(start);
  const e = new Date(s.getTime() + minutes * 60_000);
  const clean = (t) => String(t).replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cube Software//Demo//EN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:cube-demo-${id}@cube-software.com`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(s)}`,
    `DTEND:${fmt(e)}`,
    `SUMMARY:${clean(summary)}`,
    `DESCRIPTION:${clean(description)}`,
    `ORGANIZER:mailto:${organizer}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

async function send(message) {
  if (!transport) {
    console.log(`[mail] (SMTP not configured) to=${message.to} subject="${message.subject}"`);
    return;
  }
  await transport.sendMail({ from: config.smtp.from, ...message });
}

const SALES_PHONE = "+91 80 68 69 44 40";

// A new demo request, for the sales team. The visitor hears from us only once the team confirms it in the
// dashboard (mailing.js sends that email, with the calendar invite).
async function bookingRequestEmail(b, salesEmails) {
  const ist = when(b.slot_start, "Asia/Kolkata");
  await send({
    to: salesEmails.join(","),
    replyTo: b.email,
    subject: `New demo request: ${b.company} — ${ist}`,
    html: `<h2 style="font:600 20px Arial,sans-serif;color:#0047FF">New demo request: please confirm or decline it</h2>
<p style="font:14px Arial,sans-serif;color:#404348">Open the dashboard → Demo bookings and press ✓ to confirm (the visitor is then emailed) or ✗ to decline.</p>${table([
      ["Date & time (IST)", ist],
      [`Visitor's time (${b.timezone})`, when(b.slot_start, b.timezone)],
      ["Name", b.name],
      ["Email", b.email],
      ["Phone", b.phone],
      ["Company", b.company],
      ["Designation", b.designation],
      ["Team size", b.users],
      ["Interested in", b.interest],
      ["Message", b.message],
    ])}`,
  });
}

async function leadEmail(l, salesEmails) {
  await send({
    to: salesEmails.join(","),
    replyTo: l.email,
    subject: `New website enquiry: ${l.name}${l.company ? ` (${l.company})` : ""}`,
    html: `<h2 style="font:600 20px Arial,sans-serif;color:#0047FF">New enquiry from the website</h2>${table([
      ["Name", l.name],
      ["Email", l.email],
      ["Phone", l.phone],
      ["Company", l.company],
      ["Designation", l.designation],
      ["Website", l.website],
      ["Interested in", l.interest],
      ["Team size", l.users],
      ["Message", l.message],
      ["Form", l.source],
    ])}`,
  });
}

module.exports = { SALES_PHONE, bookingRequestEmail, leadEmail, send, esc, ics, table, when, configured: Boolean(transport) };
