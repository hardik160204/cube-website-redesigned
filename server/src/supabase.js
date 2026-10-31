// The two Supabase services the server uses besides the database: Auth (admin passwords) and Storage
// (uploaded images). Plain HTTPS calls; the keys never leave this server.
const config = require("./config");

const MEDIA = "media"; // Storage bucket, created by supabase/schema.sql

function headers(key, extra = {}) {
  // New-style keys (sb_publishable_ / sb_secret_) go in `apikey` only; legacy JWT keys also as a Bearer token.
  return { apikey: key, ...(key.startsWith("sb_") ? {} : { Authorization: `Bearer ${key}` }), ...extra };
}

async function call(path, { method = "GET", key = config.supabase.secretKey, body, raw, type } = {}) {
  if (!config.supabase.url || !key) {
    // Safe to show: says what's missing, not any value.
    throw Object.assign(new Error("Supabase isn't set up yet: add the project URL and keys to server/.env, then restart the server."), { status: 503, expose: true });
  }
  const hasBody = raw !== undefined || body !== undefined;
  const res = await fetch(`${config.supabase.url}${path}`, {
    method,
    // A content type without a body makes Storage refuse the request (e.g. every DELETE), so only send one with a body.
    headers: headers(key, hasBody ? { "Content-Type": type || "application/json" } : {}),
    body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

const fail = (what, r) => new Error(`${what} failed (${r.status}): ${r.data?.msg || r.data?.message || r.data?.error_description || r.data?.error || "unknown error"}`);

module.exports = {
  // Checks an email and password with Supabase Auth. Returns the Auth user's id, or null if they don't match.
  async signIn(email, password) {
    const r = await call("/auth/v1/token?grant_type=password", { method: "POST", key: config.supabase.anonKey, body: { email, password } });
    if (r.ok) return r.data.user?.id || null;
    if (r.status === 400 || r.status === 401 || r.status === 422) return null;
    throw fail("Sign-in", r);
  },

  // Creates a confirmed Auth user, or sets a new password if the email already exists. Returns the user id.
  async upsertUser(email, password) {
    const created = await call("/auth/v1/admin/users", { method: "POST", body: { email, password, email_confirm: true } });
    if (created.ok) return created.data.id;
    if (created.status !== 422 && created.status !== 400) throw fail("Creating the user", created);
    const id = await module.exports.findUser(email);
    if (!id) throw fail("Creating the user", created);
    await module.exports.setPassword(id, password);
    return id;
  },

  async findUser(email) {
    for (let page = 1; page <= 20; page++) {
      const r = await call(`/auth/v1/admin/users?page=${page}&per_page=100`);
      if (!r.ok) throw fail("Looking up users", r);
      const user = (r.data.users || []).find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (user) return user.id;
      if ((r.data.users || []).length < 100) return null;
    }
    return null;
  },

  async setPassword(id, password) {
    const r = await call(`/auth/v1/admin/users/${encodeURIComponent(id)}`, { method: "PUT", body: { password } });
    if (!r.ok) throw fail("Changing the password", r);
  },

  async deleteUser(id) {
    const r = await call(`/auth/v1/admin/users/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!r.ok && r.status !== 404) throw fail("Removing the user", r);
  },

  async upload(file, buffer, mime) {
    const r = await call(`/storage/v1/object/${MEDIA}/${file}`, { method: "POST", raw: buffer, type: mime });
    if (!r.ok) throw fail("Uploading the image", r);
  },

  async remove(file) {
    const r = await call(`/storage/v1/object/${MEDIA}/${file}`, { method: "DELETE" });
    if (!r.ok && r.status !== 404) throw fail("Deleting the image", r);
  },

  // A link the browser can PUT exactly one file to, straight into Storage. It carries a short-lived token for
  // that one file name only, so no key ever reaches the browser, and big videos skip this server (Vercel caps
  // a request at 4.5 MB).
  async signUpload(file) {
    const r = await call(`/storage/v1/object/upload/sign/${MEDIA}/${file}`, { method: "POST", body: {} });
    if (!r.ok || !r.data.url) throw fail("Preparing the upload", r);
    return `${config.supabase.url}/storage/v1${r.data.url}`;
  },

  // The first bytes of an uploaded file (to check what it really is) and its full size; null if it's missing.
  async readStart(file) {
    const res = await fetch(module.exports.publicUrl(file), { headers: { Range: "bytes=0-31" } });
    if (!res.ok) return null;
    const size = Number((res.headers.get("content-range") || "").split("/")[1]) || Number(res.headers.get("content-length")) || 0;
    return { buf: Buffer.from(await res.arrayBuffer()), size };
  },

  publicUrl: (file) => `${config.supabase.url}/storage/v1/object/public/${MEDIA}/${file}`,
};
