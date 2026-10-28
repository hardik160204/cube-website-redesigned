// Server-side validation for every form. The browser checks are a convenience; these are the real ones.
// Each field is trimmed, length-limited and type-checked; unknown fields are dropped.

// One plain address only: no commas, semicolons, quotes or spaces that could add recipients to an email.
const EMAIL = /^[A-Za-z0-9._%+\-]{1,64}@[A-Za-z0-9.\-]{1,190}\.[A-Za-z]{2,24}$/;
const PHONE = /^[+()\-.\s\d]{7,20}$/;
const URL = /^https?:\/\/[^\s<>"']{3,200}$/i;

function str(v, max, multiline) {
  if (v === undefined || v === null) return "";
  if (typeof v !== "string") return null;
  // Strip control characters. Only multi-line fields keep tabs and line breaks: one-line fields end up in
  // email subjects and headers, where a line break could inject a header.
  const s = (multiline ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") : v.replace(/[\u0000-\u001F\u007F]+/g, " ").replace(/ {2,}/g, " ")).trim();
  return s.length > max ? null : s;
}

// rules: { field: { max, required, pattern, oneOf } } -> { data } or { error }
function check(input, rules) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { error: "Invalid request." };
  const data = {};
  for (const [field, r] of Object.entries(rules)) {
    const v = str(input[field], r.max, r.multiline);
    if (v === null) return { error: `${r.label || field} is too long or invalid.` };
    if (r.required && !v) return { error: `${r.label || field} is required.` };
    if (v && r.pattern && !r.pattern.test(v)) return { error: `${r.label || field} is not valid.` };
    if (v && r.oneOf && !r.oneOf.includes(v)) return { error: `${r.label || field} is not valid.` };
    data[field] = v;
  }
  return { data };
}

const INTERESTS = ["", "cloud-contact-center", "voice-logger", "call-billing", "ivrs", "other"];
const TEAM_SIZES = ["", "1-10", "11-50", "51-200", "201+"];

const PERSON = {
  name: { max: 100, required: true, label: "Full name" },
  email: { max: 254, required: true, pattern: EMAIL, label: "Email" },
  phone: { max: 20, required: true, pattern: PHONE, label: "Phone number" },
  company: { max: 150, label: "Company" },
  designation: { max: 100, label: "Designation" },
  interest: { max: 40, oneOf: INTERESTS, label: "Interest" },
  users: { max: 10, oneOf: TEAM_SIZES, label: "Number of users" },
  message: { max: 2000, multiline: true, label: "Message" },
};

const LEAD_RULES = { ...PERSON, website: { max: 200, pattern: URL, label: "Website" } };
const BOOKING_RULES = {
  ...PERSON,
  company: { ...PERSON.company, required: true },
  slot: { max: 30, required: true, pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/, label: "Time slot" },
  timezone: { max: 64, required: true, pattern: /^[A-Za-z_]+(?:\/[A-Za-z0-9_+\-]+){0,2}$|^UTC$/, label: "Time zone" },
};

module.exports = { check, LEAD_RULES, BOOKING_RULES, EMAIL, INTERESTS, TEAM_SIZES };
