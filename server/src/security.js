// Admin authentication, two steps: the password (checked by Supabase Auth), then a 6-digit code from the
// admin's authenticator app (TOTP) — no email or SMTP involved. Only Auth users on the admins table get in.
// The server then keeps its own session: a random token stored only as a hash, in an httpOnly,
// SameSite=Strict browser-session cookie (gone when the browser closes), ending after 30 minutes idle or
// 12 hours in all. Five wrong passwords lock the account; every change also needs a CSRF header.
const crypto = require("node:crypto");
const config = require("./config");
const supabase = require("./supabase");
const totp = require("./totp");

// __Host- cookies can only be set over HTTPS, for this exact host and path: no subdomain can plant or read them.
const COOKIE = config.production ? "__Host-cube_admin" : "cube_admin";
const PENDING = config.production ? "__Host-cube_pending" : "cube_pending";
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const CODE_MINUTES = 10; // how long the pending-login (between password and authenticator code) lasts
const MAX_CODE_ATTEMPTS = 5;
const IDLE_MS = 30 * 60_000;

// Passwords: at least 12 characters with a letter and a digit.
function strongPassword(p) {
  return typeof p === "string" && p.length >= 12 && p.length <= 200 && /[A-Za-z]/.test(p) && /\d/.test(p);
}

const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const token = () => crypto.randomBytes(32).toString("base64url");

async function audit(db, req, action, { admin, email = "", detail = "" } = {}) {
  await db.run(
    "INSERT INTO audit_log (admin_id, email, action, detail, ip) VALUES (?, ?, ?, ?, ?)",
    admin?.id ?? null,
    String(admin?.email || email).slice(0, 254),
    action,
    String(detail).slice(0, 300),
    String(req.ip || "").slice(0, 64)
  );
}

async function createSession(db, adminId) {
  const t = token();
  const now = Date.now();
  await db.run("DELETE FROM sessions WHERE expires_at < ? OR last_seen < ?", now, now - IDLE_MS);
  await db.run("INSERT INTO sessions (token_hash, admin_id, expires_at, last_seen) VALUES (?, ?, ?, ?)", sha256(t), adminId, now + config.sessionHours * 3_600_000, now);
  return t;
}

// Step 1: email + password. On success, starts a pending login and tells the client which second step to
// show — "totp" (enter the authenticator code) or "totp_setup" (first time: scan this QR, then enter a code).
// Returns { ok:false, locked? } or { ok:true, step, pending, otpauth?, secret? }.
async function login(db, req, email, password) {
  const now = Date.now();
  email = String(email || "").trim();
  const admin = await db.get("SELECT * FROM admins WHERE lower(email) = lower(?)", email);
  if (admin && admin.locked_until > now) {
    await audit(db, req, "login_blocked_locked", { admin });
    return { ok: false, locked: true };
  }
  // Ask Supabase even for unknown emails, so the answer takes the same time either way.
  const authId = await supabase.signIn(email, String(password || ""));
  if (!admin || !authId || authId !== admin.auth_user_id) {
    await audit(db, req, "login_failed", { admin, email });
    if (!admin) return { ok: false };
    const attempts = admin.failed_attempts + 1;
    const lockedUntil = attempts >= MAX_ATTEMPTS ? now + LOCK_MINUTES * 60_000 : 0;
    await db.run("UPDATE admins SET failed_attempts = ?, locked_until = ? WHERE id = ?", attempts >= MAX_ATTEMPTS ? 0 : attempts, lockedUntil, admin.id);
    if (lockedUntil) await audit(db, req, "account_locked", { admin });
    return { ok: false, locked: lockedUntil > 0 };
  }
  await db.run("UPDATE admins SET failed_attempts = 0, locked_until = 0 WHERE id = ?", admin.id);

  // Start a fresh pending login tied to a cookie. First time (no authenticator yet) → enrolment.
  const pending = token();
  await db.run("DELETE FROM login_challenges WHERE admin_id = ? OR expires_at < ?", admin.id, now);
  const enrolled = Boolean(admin.totp_secret);
  let newSecret = null;
  let pendingSecret = null;
  if (!enrolled) {
    newSecret = totp.generateSecret();
    pendingSecret = totp.encryptSecret(newSecret);
  }
  await db.run(
    "INSERT INTO login_challenges (token_hash, admin_id, expires_at, pending_secret) VALUES (?, ?, ?, ?)",
    sha256(pending),
    admin.id,
    now + CODE_MINUTES * 60_000,
    pendingSecret
  );
  await audit(db, req, enrolled ? "login_totp_prompt" : "login_totp_setup", { admin });
  return enrolled
    ? { ok: true, step: "totp", pending }
    : { ok: true, step: "totp_setup", pending, otpauth: totp.otpauthURL(newSecret, admin.email), secret: newSecret };
}

async function pendingLogin(db, req) {
  const t = readCookie(req, PENDING);
  if (!t || t.length > 100) return null;
  const row = await db.get(
    "SELECT c.token_hash, c.expires_at, c.attempts, c.pending_secret, a.id, a.email, a.auth_user_id, a.totp_secret FROM login_challenges c JOIN admins a ON a.id = c.admin_id WHERE c.token_hash = ?",
    sha256(t)
  );
  if (!row || row.expires_at < Date.now()) return null;
  return row;
}

// Step 2: the 6-digit code from the authenticator app. On enrolment, the pending secret is confirmed and
// saved to the admin. Returns { ok:true, session, admin } or { ok:false, expired? }.
async function verifyCode(db, req, code) {
  const p = await pendingLogin(db, req);
  if (!p) return { ok: false, expired: true };
  const admin = { id: p.id, email: p.email };
  const enrolling = Boolean(p.pending_secret);
  const secret = enrolling ? totp.decryptSecret(p.pending_secret) : totp.decryptSecret(p.totp_secret);
  const good = secret && totp.verify(secret, typeof code === "string" ? code : "");
  if (!good) {
    const attempts = p.attempts + 1;
    if (attempts >= MAX_CODE_ATTEMPTS) await db.run("DELETE FROM login_challenges WHERE token_hash = ?", p.token_hash);
    else await db.run("UPDATE login_challenges SET attempts = ? WHERE token_hash = ?", attempts, p.token_hash);
    await audit(db, req, "login_code_failed", { admin, detail: enrolling ? "enrolment" : "" });
    return { ok: false, expired: attempts >= MAX_CODE_ATTEMPTS };
  }
  if (enrolling) await db.run("UPDATE admins SET totp_secret = ? WHERE id = ?", p.pending_secret, p.id);
  await db.run("DELETE FROM login_challenges WHERE token_hash = ?", p.token_hash);
  await audit(db, req, "login_ok", { admin, detail: enrolling ? "authenticator set up" : "" });
  return { ok: true, session: await createSession(db, p.id), admin };
}

function readCookie(req, name) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) {
      try {
        return decodeURIComponent(v.join("="));
      } catch {
        return null;
      }
    }
  }
  return null;
}

const cookieOptions = { httpOnly: true, secure: config.production, sameSite: "strict", path: "/" };

// No expiry date: a browser-session cookie, deleted when the browser closes. The server enforces the rest.
const setSessionCookie = (res, t) => res.cookie(COOKIE, t, cookieOptions);
const clearSessionCookie = (res) => res.clearCookie(COOKIE, cookieOptions);
const setPendingCookie = (res, t) => res.cookie(PENDING, t, { ...cookieOptions, maxAge: CODE_MINUTES * 60_000 });
const clearPendingCookie = (res) => res.clearCookie(PENDING, cookieOptions);

async function sessionAdmin(db, req) {
  const t = readCookie(req, COOKIE);
  if (!t || t.length > 100) return null;
  const tokenHash = sha256(t);
  const row = await db.get(
    "SELECT a.id, a.email, a.auth_user_id, a.is_owner, s.expires_at, s.last_seen FROM sessions s JOIN admins a ON a.id = s.admin_id WHERE s.token_hash = ?",
    tokenHash
  );
  const now = Date.now();
  if (!row) return null;
  if (row.expires_at < now || row.last_seen < now - IDLE_MS) {
    await db.run("DELETE FROM sessions WHERE token_hash = ?", tokenHash);
    return null;
  }
  if (now - row.last_seen > 60_000) await db.run("UPDATE sessions SET last_seen = ? WHERE token_hash = ?", now, tokenHash);
  return { id: row.id, email: row.email, authUserId: row.auth_user_id, isOwner: row.is_owner, tokenHash };
}

// Admin API guard. Changes also need the X-Cube-Admin header, which a cross-site form or image cannot send
// (and no CORS is enabled), on top of the SameSite=Strict cookie. Every change is written to the audit log.
function requireAdmin(db) {
  return async (req, res, next) => {
    const admin = await sessionAdmin(db, req);
    if (!admin) return res.status(401).json({ error: "Please sign in." });
    if (req.method !== "GET" && req.get("X-Cube-Admin") !== "1") return res.status(403).json({ error: "Forbidden." });
    req.admin = admin;
    if (req.method !== "GET") await audit(db, req, "change", { admin, detail: `${req.method} ${req.path}` });
    next();
  };
}

module.exports = {
  COOKIE,
  PENDING,
  IDLE_MS,
  strongPassword,
  login,
  verifyCode,
  pendingLogin,
  audit,
  sessionAdmin,
  requireAdmin,
  setSessionCookie,
  clearSessionCookie,
  setPendingCookie,
  clearPendingCookie,
  sha256,
};
