// Settings the admin can change from the dashboard, stored as JSON in the settings table.
const config = require("./config");

const DEFAULTS = {
  salesEmails: config.salesEmails,
  demo: {
    // Times are India Standard Time (UTC+05:30, no daylight saving). Office hours from the Contact page.
    hours: {
      1: ["09:30", "20:00"],
      2: ["09:30", "20:00"],
      3: ["09:30", "20:00"],
      4: ["09:30", "20:00"],
      5: ["09:30", "20:00"],
      6: ["09:30", "16:30"],
    },
    slotMinutes: 30,
    minNoticeHours: 3,
    horizonDays: 45,
    blockedDates: [], // "YYYY-MM-DD" in IST
    meetingType: "Video call (Google Meet or Zoom)",
  },
  // How long demo bookings and enquiries are kept before automatic deletion.
  retention: { enquiryMonths: 36 },
};

async function get(db, key) {
  const row = await db.get("SELECT value FROM settings WHERE key = ?", key);
  return row ? row.value : DEFAULTS[key];
}

async function set(db, key, value) {
  await db.run("INSERT INTO settings (key, value) VALUES (?, ?::jsonb) ON CONFLICT (key) DO UPDATE SET value = excluded.value", key, JSON.stringify(value));
}

module.exports = { DEFAULTS, get, set };
