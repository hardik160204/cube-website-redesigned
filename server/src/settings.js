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

// A phone number as the admin edited it for every page in the visual editor, or as given if it wasn't edited.
// Compared by digits, because the same number is written in several formats.
const PHONE = /^\+?[\d\s()-]{7,}$/;
const digitsOf = (s) => s.replace(/\D/g, "");
async function editedPhone(db, number) {
  const edits = await db.all("SELECT original, replacement FROM overrides WHERE kind = 'text' AND scope = '*'");
  const edit = edits.find((e) => PHONE.test(e.original) && PHONE.test(e.replacement) && digitsOf(e.original) === digitsOf(number));
  return edit ? edit.replacement : number;
}

module.exports = { DEFAULTS, get, set, editedPhone };
