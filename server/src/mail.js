// Emails to the sales team (every booking and enquiry) and a confirmation to the visitor who booked a demo.
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

async function bookingEmails(b, salesEmails, demo) {
  const ist = when(b.slot_start, "Asia/Kolkata");
  const local = when(b.slot_start, b.timezone);
  const invite = ics({
    id: b.id,
    start: b.slot_start,
    minutes: demo.slotMinutes,
    summary: "Cube Software product demo",
    description: `Demo with ${b.name} (${b.company}). Phone ${b.phone}. Email ${b.email}.`,
    organizer: salesEmails[0] || "sales@cube-software.com",
  });
  const details = table([
    ["Date & time (IST)", ist],
    [`Visitor's time (${b.timezone})`, local],
    ["Name", b.name],
    ["Email", b.email],
    ["Phone", b.phone],
    ["Company", b.company],
    ["Designation", b.designation],
    ["Team size", b.users],
    ["Interested in", b.interest],
    ["Message", b.message],
  ]);
  await send({
    to: salesEmails.join(","),
    replyTo: b.email,
    subject: `New demo booked: ${b.company} — ${ist}`,
    html: `<h2 style="font:600 20px Arial,sans-serif;color:#0047FF">New demo booking</h2>${details}`,
    icalEvent: { method: "REQUEST", content: invite },
  });
  await send({
    to: b.email,
    subject: "Your Cube Software demo is scheduled",
    html: `<p style="font:15px Arial,sans-serif">Hi ${esc(b.name)},</p>
<p style="font:15px Arial,sans-serif">Thank you for booking a demo with Cube Software. Your session is on <b>${esc(local)}</b> (${esc(b.timezone)}).
Our team will send you the meeting link before the call. Need to change the time? Reply to this email or call +91 80 68 69 44 40.</p>
<p style="font:15px Arial,sans-serif">— Team Cube Software</p>`,
    icalEvent: { method: "REQUEST", content: invite },
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

module.exports = { bookingEmails, leadEmail, esc, ics, configured: Boolean(transport) };
