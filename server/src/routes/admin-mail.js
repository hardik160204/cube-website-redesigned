// Admin API for emails to visitors: confirming or declining demo requests (the visitor is emailed on the team's
// decision), the newsletter list, newsletters, unsubscribes awaiting removal, and data deletion requests.
// Mounted inside adminRoutes, so every route here already needs a signed-in admin and the CSRF header.
const mail = require("../mail");
const mailing = require("../mailing");
const { EMAIL } = require("../validate");

const isStr = (v, max, min = 0) => typeof v === "string" && v.trim().length >= min && v.length <= max;
const LINK = /^(\/[A-Za-z0-9._\-/?=&#%]{0,200}|https:\/\/[^\s<>"']{5,500})$/;
const BATCH = 20; // newsletters go out this many per request, so a send never outlasts the server's time limit

function checkCampaign(b) {
  if (!b || typeof b !== "object") return "Invalid newsletter.";
  if (!isStr(b.subject, 150, 3)) return "The subject is needed (up to 150 characters).";
  const c = b.content || {};
  if (!isStr(c.heading ?? "", 150)) return "The heading can be up to 150 characters.";
  if (!isStr(c.body ?? "", 10000, 1)) return "Write the message (up to 10,000 characters).";
  if (c.image && !(isStr(c.image, 500) && LINK.test(c.image))) return "The picture must be one from Images & videos or an https:// link.";
  if (!isStr(c.imageAlt ?? "", 150)) return "The picture's description can be up to 150 characters.";
  if (!isStr(c.buttonLabel ?? "", 40)) return "The button text can be up to 40 characters.";
  if (c.buttonUrl && !(isStr(c.buttonUrl, 500) && LINK.test(c.buttonUrl))) return "The button link must be a page of this site (/...) or an https:// link.";
  if (Boolean(c.buttonLabel) !== Boolean(c.buttonUrl)) return "A button needs both its text and its link.";
  return null;
}
const cleanCampaign = (b) => ({
  subject: b.subject.trim(),
  content: Object.fromEntries(["heading", "body", "image", "imageAlt", "buttonLabel", "buttonUrl"].map((k) => [k, String(b.content?.[k] || "").trim()])),
});

module.exports = function mailRoutes(r, db, { need, notFound, idOf }) {
  r.use(["/contacts", "/campaigns"], need("emails"));
  r.use("/deletion-requests", need("privacy"));

  // --- Demo requests: preview the email, then confirm or decline -------------------------------------------
  const booking = async (req) => {
    const id = idOf(req);
    return id ? db.get("SELECT * FROM bookings WHERE id = ?", id) : null;
  };
  r.get("/bookings/:id/email", async (req, res) => {
    const b = await booking(req);
    if (!b) return notFound(res);
    const m = await mailing.bookingEmail(db, b, req.query.confirm === "1");
    res.json({ from: m.from, to: m.to, subject: m.subject, html: m.html, ready: mail.configured });
  });
  r.post("/bookings/:id/decision", async (req, res) => {
    const b = await booking(req);
    if (!b) return notFound(res);
    if (b.status !== "pending") return res.status(409).json({ error: "This booking was already confirmed or declined." });
    const confirm = req.body?.confirm === true;
    const email = confirm || req.body?.email !== false;
    // The visitor's email goes first: if it can't be sent, nothing changes and the admin can try again.
    if (email) {
      try {
        await mailing.sendBookingDecision(db, b, confirm);
      } catch (e) {
        console.error("[mail] booking decision", b.id, e.message);
        return res.status(502).json({ error: "The email couldn't be sent, so nothing was changed. Check the email settings (SMTP) and try again." });
      }
    }
    await db.run("UPDATE bookings SET status = ?, decided_at = now() WHERE id = ?", confirm ? "scheduled" : "cancelled", b.id);
    res.json({ ok: true, emailed: email && mail.configured });
  });

  // --- The newsletter list -------------------------------------------------------------------------------
  r.get("/contacts", async (req, res) => {
    res.json({ contacts: await db.all("SELECT id, email, name, company, source, subscribed, consent_at, unsubscribed_at, created_at FROM contacts ORDER BY created_at DESC LIMIT 5000") });
  });
  r.post("/contacts", async (req, res) => {
    const { email, name = "", company = "", agreed } = req.body || {};
    if (!(isStr(email, 254) && EMAIL.test(email.trim()))) return res.status(400).json({ error: "Enter a valid email address." });
    if (!isStr(name, 120) || !isStr(company, 120)) return res.status(400).json({ error: "Name and company can be up to 120 characters." });
    if (agreed !== true) return res.status(400).json({ error: "Only add people who agreed to get our emails." });
    if (!(await mailing.subscribe(db, { email: email.trim(), name: name.trim(), company: company.trim(), source: "added in dashboard" })))
      return res.status(409).json({ error: "This person asked to be removed from our emails, so they can't be added again." });
    res.status(201).json({ ok: true });
  });
  // Approving an unsubscribe (or removing anyone): their details are deleted and only a hash of the address is
  // kept, so they are never added again.
  r.delete("/contacts/:id", async (req, res) => {
    const id = idOf(req);
    const c = id && (await db.get("SELECT email FROM contacts WHERE id = ?", id));
    if (!c) return notFound(res);
    await db.run("INSERT INTO email_suppressions (email_hash) VALUES (?) ON CONFLICT DO NOTHING", mailing.hash(c.email));
    await db.run("DELETE FROM contacts WHERE id = ?", id);
    res.json({ ok: true });
  });

  // --- Newsletters ---------------------------------------------------------------------------------------
  r.get("/campaigns", async (req, res) => {
    const audience = (await db.get("SELECT COUNT(*)::int n FROM contacts WHERE subscribed")).n;
    res.json({ campaigns: await db.all("SELECT * FROM campaigns ORDER BY id DESC LIMIT 200"), audience, sender: await mailing.sender(db), ready: mail.configured });
  });
  r.post("/campaigns", async (req, res) => {
    const err = checkCampaign(req.body);
    if (err) return res.status(400).json({ error: err });
    const c = cleanCampaign(req.body);
    const { row } = await db.run("INSERT INTO campaigns (subject, content) VALUES (?, ?::jsonb) RETURNING id", c.subject, JSON.stringify(c.content));
    res.status(201).json({ id: row.id });
  });
  const draft = async (req, res) => {
    const id = idOf(req);
    const c = id && (await db.get("SELECT * FROM campaigns WHERE id = ?", id));
    if (!c) notFound(res);
    return c || null;
  };
  r.put("/campaigns/:id", async (req, res) => {
    const c = await draft(req, res);
    if (!c) return;
    if (c.status !== "draft") return res.status(409).json({ error: "This newsletter has been sent, so it can't be changed. Copy it into a new one." });
    const err = checkCampaign(req.body);
    if (err) return res.status(400).json({ error: err });
    const n = cleanCampaign(req.body);
    await db.run("UPDATE campaigns SET subject = ?, content = ?::jsonb WHERE id = ?", n.subject, JSON.stringify(n.content), c.id);
    res.json({ ok: true });
  });
  r.delete("/campaigns/:id", async (req, res) => {
    const c = await draft(req, res);
    if (!c) return;
    if (c.status === "sending") return res.status(409).json({ error: "Finish sending this newsletter first." });
    await db.run("DELETE FROM campaigns WHERE id = ?", c.id);
    res.json({ ok: true });
  });
  r.get("/campaigns/:id/preview", async (req, res) => {
    const c = await draft(req, res);
    if (!c) return;
    const m = mailing.campaignEmail(await mailing.sender(db), c, "you@example.com");
    res.json({ from: m.from, subject: m.subject, html: m.html });
  });
  r.post("/campaigns/:id/test", async (req, res) => {
    const c = await draft(req, res);
    if (!c) return;
    const to = String(req.body?.email || "").trim();
    if (!EMAIL.test(to)) return res.status(400).json({ error: "Enter the email address to send the test to." });
    try {
      await mail.send(mailing.campaignEmail(await mailing.sender(db), { ...c, subject: `[Test] ${c.subject}` }, to));
    } catch (e) {
      return res.status(502).json({ error: `The test couldn't be sent: ${e.message}` });
    }
    res.json({ ok: true, sent: mail.configured });
  });
  // Sends the next batch to subscribed people who haven't had it yet; the dashboard calls this until none remain.
  r.post("/campaigns/:id/send", async (req, res) => {
    const c = await draft(req, res);
    if (!c) return;
    if (c.status === "sent") return res.json({ sent: 0, remaining: 0 });
    if (!mail.configured) return res.status(400).json({ error: "Email sending isn't set up yet (SMTP settings on the server)." });
    await db.run("UPDATE campaigns SET status = 'sending' WHERE id = ?", c.id);
    const s = await mailing.sender(db);
    const next = await db.all(
      "SELECT id, email FROM contacts WHERE subscribed AND id NOT IN (SELECT contact_id FROM campaign_sends WHERE campaign_id = ?) ORDER BY id LIMIT ?",
      c.id,
      BATCH
    );
    let sent = 0;
    for (const p of next) {
      // Claim the person first, so two admins sending at once never email anyone twice.
      const { changes } = await db.run("INSERT INTO campaign_sends (campaign_id, contact_id) VALUES (?, ?) ON CONFLICT DO NOTHING", c.id, p.id);
      if (!changes) continue;
      try {
        await mail.send(mailing.campaignEmail(s, c, p.email));
        sent++;
      } catch (e) {
        await db.run("DELETE FROM campaign_sends WHERE campaign_id = ? AND contact_id = ?", c.id, p.id);
        console.error("[mail] newsletter", c.id, e.message);
        return res.status(502).json({ error: `Sending stopped: ${e.message}. Press Send again to continue; nobody gets it twice.` });
      }
    }
    const remaining = (await db.get("SELECT COUNT(*)::int n FROM contacts WHERE subscribed AND id NOT IN (SELECT contact_id FROM campaign_sends WHERE campaign_id = ?)", c.id)).n;
    const total = (await db.get("SELECT COUNT(*)::int n FROM campaign_sends WHERE campaign_id = ?", c.id)).n;
    await db.run("UPDATE campaigns SET sent_count = ?, status = ?, sent_at = CASE WHEN ? THEN now() ELSE sent_at END WHERE id = ?", total, remaining ? "sending" : "sent", !remaining, c.id);
    res.json({ sent, remaining, total });
  });

  // --- Data deletion requests from the website's form ---------------------------------------------------------
  r.get("/deletion-requests", async (req, res) => res.json({ requests: await db.all("SELECT * FROM deletion_requests ORDER BY id DESC LIMIT 500") }));
  r.patch("/deletion-requests/:id", async (req, res) => {
    const id = idOf(req);
    const status = req.body?.status;
    if (!id || !["open", "done", "rejected"].includes(status)) return res.status(400).json({ error: "Invalid request." });
    const { changes } = await db.run("UPDATE deletion_requests SET status = ?, closed_at = CASE WHEN ? = 'open' THEN NULL ELSE now() END WHERE id = ?", status, status, id);
    if (!changes) return notFound(res);
    res.json({ ok: true });
  });
};
