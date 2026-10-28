// Everything environment-specific comes from environment variables (see .env.example). Nothing secret is
// committed to the code.
const path = require("node:path");

// Load server/.env if present (KEY=value lines), without overriding variables already set.
try {
  const lines = require("node:fs").readFileSync(path.join(__dirname, "..", ".env"), "utf8").split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
  }
} catch {
  /* no .env file: rely on the real environment */
}

const env = process.env;
// "PASTE_..." placeholders in .env count as not set.
const filled = (v) => (v && !v.startsWith("PASTE_") ? v.trim() : "");
const production = env.NODE_ENV === "production";
// On Vercel the app runs as a serverless function: one shared proxy in front, a read-only disk, and no
// long-running process, so a few things below behave differently there.
const serverless = Boolean(env.VERCEL);

// A stable server secret used to encrypt data at rest (e.g. authenticator secrets). Set APP_SECRET in .env;
// if it's missing we fall back to the Supabase service key so the app still runs, but then rotating that key
// makes stored authenticator secrets unreadable and admins must re-enrol.
const appSecret = filled(env.APP_SECRET) || filled(env.SUPABASE_SERVICE_ROLE_KEY) || "cube-development-only-secret";

module.exports = {
  production,
  serverless,
  appSecret,
  port: Number(env.PORT || 5000),
  siteUrl: (env.SITE_URL || "http://localhost:5000").replace(/\/$/, ""),
  databaseUrl: filled(env.DATABASE_URL),
  dbCaFile: env.DB_CA_FILE || "",
  // The same certificate pasted straight into an environment variable, for hosts with no writable disk
  // (Vercel). Either this or DB_CA_FILE satisfies the production TLS check.
  dbCaCert: filled(env.DB_CA_CERT),
  // The schema is created/updated on start-up. Serverless starts constantly, so there it is applied by
  // running the SQL in supabase/schema.sql yourself (see the README) instead of on every cold start.
  applySchema: env.APPLY_SCHEMA ? env.APPLY_SCHEMA === "true" : !serverless,
  // Vercel Cron calls /api/cron/retention with this secret, since serverless has no long-running timer.
  cronSecret: filled(env.CRON_SECRET),
  supabase: {
    url: filled(env.SUPABASE_URL).replace(/\/$/, ""),
    anonKey: filled(env.SUPABASE_ANON_KEY), // public key: used only to check admin passwords with Supabase Auth
    secretKey: filled(env.SUPABASE_SERVICE_ROLE_KEY), // server-only: admin accounts and image uploads
  },
  buildDir: env.BUILD_DIR || path.join(__dirname, "..", "..", "frontend", "build"),
  seoRoutesFile: env.SEO_ROUTES_FILE || path.join(__dirname, "..", "..", "frontend", "src", "seo", "routes.json"),
  // Trust X-Forwarded-For only from a proxy on this same machine (Nginx/IIS, or the dev server). On Vercel
  // the only way in is Vercel's own proxy, which sets the visitor's IP one hop away — without this, every
  // visitor looks like the same IP and they all share one rate-limit bucket.
  trustProxy: env.TRUST_PROXY || (serverless ? 1 : "loopback"),
  smtp: {
    host: filled(env.SMTP_HOST),
    port: Number(env.SMTP_PORT || 587),
    secure: env.SMTP_SECURE === "true",
    user: filled(env.SMTP_USER),
    pass: filled(env.SMTP_PASS), // a PASTE_... placeholder counts as not set
    from: env.MAIL_FROM || "Cube Software <no-reply@cube-software.com>",
  },
  // Fallback recipients until they are set in the admin dashboard.
  salesEmails: (env.SALES_EMAILS || "sales@cube-software.com").split(",").map((s) => s.trim()).filter(Boolean),
  sessionHours: Number(env.SESSION_HOURS || 12),
  // Stored with every booking and enquiry. Update it when the Terms or Privacy Policy pages change.
  termsVersion: "Terms 26 Oct 2026 / Privacy 27 Oct 2026 rev 2",
};
