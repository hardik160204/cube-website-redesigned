// Data retention: a sweep that runs at start-up and every 6 hours and deletes what is past its time.
//   Admin sessions and sign-in codes   when they expire (30 min idle / 12 h / 10 min)
//   Cookie-consent receipts            13 months after the visitor's last choice (they're asked again after 12)
//   Analytics page views               13 months
//   Security / processing log          1 year (DPDP Rules; CERT-In asks for at least 180 days)
//   Demo bookings and enquiries        the admin's setting, 36 months by default, counted from when they came in
//   Admin slot rules                   once the slot is a day in the past
const settings = require("./settings");
const { IDLE_MS } = require("./security");

async function sweep(db, now = Date.now()) {
  const { enquiryMonths } = await settings.get(db, "retention");
  const del = async (sql, ...p) => (await db.run(sql, ...p)).changes;
  return {
    sessions: await del("DELETE FROM sessions WHERE expires_at < ? OR last_seen < ?", now, now - IDLE_MS),
    signInCodes: await del("DELETE FROM login_challenges WHERE expires_at < ?", now),
    consents: await del("DELETE FROM consents WHERE updated_at < now() - interval '13 months'"),
    pageViews: await del("DELETE FROM page_views WHERE at < now() - interval '13 months'"),
    auditLog: await del("DELETE FROM audit_log WHERE at < now() - interval '1 year'"),
    bookings: await del("DELETE FROM bookings WHERE created_at < now() - make_interval(months => ?) AND slot_start < ?", enquiryMonths, new Date(now).toISOString()),
    leads: await del("DELETE FROM leads WHERE created_at < now() - make_interval(months => ?)", enquiryMonths),
    slotRules: await del("DELETE FROM slot_rules WHERE slot_start < ?", new Date(now - 86_400_000).toISOString()),
  };
}

function start(db) {
  const run = async () => {
    try {
      const done = await sweep(db);
      const removed = Object.entries(done).filter(([k, n]) => n && !["sessions", "signInCodes"].includes(k));
      if (removed.length) {
        const detail = removed.map(([k, n]) => `${k}: ${n}`).join(", ");
        console.log(`[retention] deleted ${detail}`);
        await db.run("INSERT INTO audit_log (action, detail) VALUES (?, ?)", "retention_sweep", detail);
      }
    } catch (e) {
      console.error("[retention]", e.message);
    }
  };
  run();
  setInterval(run, 6 * 3_600_000).unref();
}

module.exports = { sweep, start };
