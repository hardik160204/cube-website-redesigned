// End-to-end checks of the API on an in-memory Postgres (PGlite): bookings, enquiries, admin auth, CSRF
// guard, injection attempts and upload filtering. Supabase Auth and Storage are replaced by in-memory
// stand-ins, so the tests run offline. Run with: npm test
process.env.LOGIN_RATE_LIMIT = "1000";
const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { open } = require("../src/db");
const { createApp } = require("../src/app");
const slots = require("../src/slots");
const settings = require("../src/settings");
const { check, LEAD_RULES } = require("../src/validate");
const { strongPassword } = require("../src/security");
const totp = require("../src/totp");
const supabase = require("../src/supabase");

// Stand-ins for Supabase Auth and Storage (the second factor is our own TOTP, so no Supabase email is used).
const users = new Map(); // email -> { id, password }
const stored = new Map(); // file -> bytes
supabase.signIn = async (email, password) => {
  const u = users.get(email.toLowerCase());
  return u && u.password === password ? u.id : null;
};
supabase.upsertUser = async (email, password) => {
  const u = users.get(email.toLowerCase()) || { id: crypto.randomUUID() };
  u.password = password;
  users.set(email.toLowerCase(), u);
  return u.id;
};
supabase.setPassword = async (id, password) => {
  for (const u of users.values()) if (u.id === id) u.password = password;
};
supabase.deleteUser = async () => {};
supabase.upload = async (file, buffer) => stored.set(file, buffer);
supabase.remove = async (file) => stored.delete(file);
supabase.publicUrl = (file) => `https://example.supabase.co/storage/v1/object/public/media/${file}`;
supabase.signUpload = async (file) => `https://example.supabase.co/storage/v1/object/upload/sign/media/${file}?token=t`;
supabase.readStart = async (file) => (stored.has(file) ? { buf: stored.get(file).subarray(0, 32), size: stored.get(file).length } : null);

// Remembers each admin's authenticator secret (captured during enrolment) to compute its current code.
const secrets = new Map(); // email -> base32 secret

let db;
let base;
let server;

async function addAdmin(email, password) {
  await db.run("INSERT INTO admins (email, auth_user_id, is_owner) VALUES (?, ?, NOT EXISTS (SELECT 1 FROM admins WHERE is_owner))", email, await supabase.upsertUser(email, password));
}

test.before(async () => {
  db = await open("memory:");
  server = createApp(db).listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${server.address().port}`;
  await addAdmin("admin@cube-software.com", "correct-horse-42");
});
test.after(async () => {
  server.close();
  await db.close();
});

const api = (path, { method = "GET", body, cookie, csrf = true, raw } = {}) =>
  fetch(base + path, {
    method,
    headers: {
      ...(body !== undefined && !raw ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...(csrf ? { "X-Cube-Admin": "1" } : {}),
    },
    body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });

const person = { name: "Asha Rao", email: "asha@example.com", phone: "+91 98100 00000", company: "Acme", consent: true };

const cookieFrom = (res) => res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");

// Both sign-in steps: password, then the authenticator code (enrolling the first time). Returns the cookie.
async function signIn(email = "admin@cube-software.com", password = "correct-horse-42") {
  const step1 = await api("/api/admin/login", { method: "POST", body: { email, password } });
  assert.equal(step1.status, 200);
  const r = await step1.json();
  if (r.step === "totp_setup") secrets.set(email.toLowerCase(), r.secret); // first time: remember the secret
  const secret = secrets.get(email.toLowerCase());
  const pending = cookieFrom(step1);
  const step2 = await api("/api/admin/login/code", { method: "POST", cookie: pending, body: { code: totp.generate(secret) } });
  assert.equal(step2.status, 200);
  return cookieFrom(step2).split("; ").find((c) => c.startsWith("cube_admin="));
}

test("slots are IST office hours returned in UTC", () => {
  const demo = settings.DEFAULTS.demo;
  const monday = slots.slotsForDate("2030-01-07", demo, new Set(), Date.UTC(2030, 0, 1));
  assert.equal(monday[0], "2030-01-07T04:00:00.000Z"); // 09:30 IST
  assert.equal(monday.at(-1), "2030-01-07T14:00:00.000Z"); // 19:30 IST, last 30-minute slot before 20:00
  assert.deepEqual(slots.slotsForDate("2030-01-06", demo, new Set(), Date.UTC(2030, 0, 1)), []); // Sunday closed
  assert.equal(slots.isBookable("2030-01-07T04:00:00.000Z", demo, new Set(["2030-01-07T04:00:00.000Z"]), Date.UTC(2030, 0, 1)), false);
  assert.equal(slots.isBookable("2030-01-07T04:10:00.000Z", demo, new Set(), Date.UTC(2030, 0, 1)), false); // not on the grid
});

test("slot rules: blocked slots disappear, added slots appear, past and too-soon slots close by themselves", () => {
  const demo = settings.DEFAULTS.demo;
  const now = Date.UTC(2030, 0, 1);
  const first = "2030-01-07T04:00:00.000Z"; // Monday 09:30 IST
  const extra = "2030-01-06T05:30:00.000Z"; // Sunday 11:00 IST, normally closed
  const rules = new Map([[first, "block"], [extra, "open"]]);
  assert.ok(!slots.slotsForDate("2030-01-07", demo, new Set(), now, rules).includes(first));
  assert.deepEqual(slots.slotsForDate("2030-01-06", demo, new Set(), now, rules), [extra]);
  assert.ok(slots.isBookable(extra, demo, new Set(), now, rules));
  assert.ok(!slots.isBookable(first, demo, new Set(), now, rules));
  // An hour before the 09:30 slot, with 3 hours' notice, it has closed automatically.
  assert.ok(!slots.isBookable("2030-01-07T04:30:00.000Z", demo, new Set(), Date.parse("2030-01-07T03:30:00.000Z")));
  const day = slots.daySchedule("2030-01-07", demo, new Map([["2030-01-07T05:00:00.000Z", { id: 1, name: "A", company: "B" }]]), now, rules);
  const state = (iso) => day.slots.find((s) => s.start === iso).state;
  assert.equal(state(first), "blocked");
  assert.equal(state("2030-01-07T05:00:00.000Z"), "booked");
  assert.equal(state("2030-01-07T04:30:00.000Z"), "open");
  const later = slots.daySchedule("2030-01-07", demo, new Map(), Date.parse("2030-01-07T06:00:00.000Z"));
  assert.equal(later.slots.find((s) => s.start === "2030-01-07T05:00:00.000Z").state, "closed");
});

test("validation trims, strips control characters and drops unknown fields", () => {
  const { data } = check({ ...person, name: "  Asha\u0000 Rao ", role: "admin" }, LEAD_RULES);
  assert.equal(data.name, "Asha Rao");
  assert.equal("role" in data, false);
  assert.ok(check({ ...person, email: "not-an-email" }, LEAD_RULES).error);
  assert.ok(check({ ...person, name: { $ne: 1 } }, LEAD_RULES).error);
  assert.ok(check({ ...person, website: "javascript:alert(1)" }, LEAD_RULES).error);
  assert.ok(check({ ...person, email: "a@b.com,victim@c.com" }, LEAD_RULES).error);
  assert.equal(check({ ...person, company: "Acme\r\nBcc: x@y.com" }, LEAD_RULES).data.company, "Acme Bcc: x@y.com");
  assert.equal(check({ ...person, message: "line 1\nline 2" }, LEAD_RULES).data.message, "line 1\nline 2");
});

test("admin passwords must be strong", () => {
  assert.ok(!strongPassword("short1"));
  assert.ok(!strongPassword("onlyletterslongenough"));
  assert.ok(strongPassword("long-enough-pass-1"));
});

test("a demo booking is stored, SQL in fields stays plain text, and a slot cannot be booked twice", async () => {
  const avail = await (await api("/api/availability?days=14")).json();
  assert.ok(avail.slots.length > 0);
  const slot = avail.slots[0];
  const evil = "Robert'); DROP TABLE bookings;--";
  let res = await api("/api/bookings", { method: "POST", body: { ...person, name: evil, slot, timezone: "Asia/Kolkata" } });
  assert.equal(res.status, 201);
  assert.equal((await db.get("SELECT name FROM bookings")).name, evil);
  res = await api("/api/bookings", { method: "POST", body: { ...person, slot, timezone: "Asia/Kolkata" } });
  assert.equal(res.status, 409);
  const after = await (await api("/api/availability?days=14")).json();
  assert.ok(!after.slots.includes(slot));
});

test("bookings need consent, a real slot and a real time zone", async () => {
  const slot = (await (await api("/api/availability?days=14")).json()).slots[1];
  assert.equal((await api("/api/bookings", { method: "POST", body: { ...person, consent: false, slot, timezone: "Asia/Kolkata" } })).status, 400);
  assert.equal((await api("/api/bookings", { method: "POST", body: { ...person, slot: "2001-01-01T04:00:00.000Z", timezone: "Asia/Kolkata" } })).status, 409);
  assert.equal((await api("/api/bookings", { method: "POST", body: { ...person, slot, timezone: "Mars/Olympus" } })).status, 400);
  assert.equal((await api("/api/bookings", { method: "POST", body: { ...person, slot, timezone: "Asia/Kolkata", company: "" } })).status, 400);
});

test("enquiries are stored; bots filling the honeypot are silently dropped", async () => {
  const count = async () => (await db.get("SELECT COUNT(*)::int n FROM leads")).n;
  assert.equal((await api("/api/leads", { method: "POST", body: { ...person, message: "<script>alert(1)</script>" } })).status, 201);
  const before = await count();
  assert.equal((await api("/api/leads", { method: "POST", body: { ...person, company_website: "spam" } })).status, 200);
  assert.equal(await count(), before);
});

test("cookie consent receipts are stored and updated", async () => {
  const first = await (await api("/api/consents", { method: "POST", body: { functional: true, version: "2026-10" } })).json();
  assert.match(first.id, /^[0-9a-f-]{36}$/);
  await api("/api/consents", { method: "POST", body: { id: first.id, functional: false, version: "2026-10" } });
  assert.equal((await db.get("SELECT functional FROM consents WHERE id = ?", first.id)).functional, false);
  const bad = await (await api("/api/consents", { method: "POST", body: { id: "'; DROP TABLE consents;--", functional: true } })).json();
  assert.notEqual(bad.id, "'; DROP TABLE consents;--");
});

test("broken or oversized JSON gets a clean error", async () => {
  const res = await api("/api/leads", { method: "POST", raw: "{bad json", body: "" });
  assert.equal(res.status, 400);
  const big = await api("/api/leads", { method: "POST", body: { ...person, message: "x".repeat(30_000) } });
  assert.equal(big.status, 413);
});

test("admin routes need a session, and changes need the CSRF header", async () => {
  assert.equal((await api("/api/admin/leads")).status, 401);
  assert.equal((await api("/api/admin/leads", { cookie: "cube_admin=forged" })).status, 401);
  const cookie = await signIn();
  assert.equal((await api("/api/admin/leads", { cookie })).status, 200);
  assert.equal((await api("/api/admin/stats", { cookie })).status, 200);
  assert.equal((await api("/api/admin/settings/salesEmails", { method: "PUT", cookie, csrf: false, body: { value: ["a@b.co"] } })).status, 403);
  assert.equal((await api("/api/admin/settings/salesEmails", { method: "PUT", cookie, body: { value: ["sales@cube-software.com"] } })).status, 200);
  assert.deepEqual((await (await api("/api/admin/settings", { cookie })).json()).salesEmails, ["sales@cube-software.com"]);
  assert.equal((await api("/api/admin/settings/salesEmails", { method: "PUT", cookie, body: { value: ["x'); DROP TABLE settings;--"] } })).status, 400);
  assert.equal((await api("/api/admin/bookings/1;DROP", { method: "DELETE", cookie })).status, 404);
  await api("/api/admin/logout", { method: "POST", cookie });
  assert.equal((await api("/api/admin/leads", { cookie })).status, 401);
});

test("login: SQL injection fails and repeated failures lock the account", async () => {
  await addAdmin("lock@cube-software.com", "another-pass-77");
  const inject = await api("/api/admin/login", { method: "POST", body: { email: "' OR 1=1 --", password: "' OR '1'='1" } });
  assert.equal(inject.status, 401);
  for (let i = 0; i < 5; i++) await api("/api/admin/login", { method: "POST", body: { email: "lock@cube-software.com", password: "nope-nope-123" } });
  const locked = await api("/api/admin/login", { method: "POST", body: { email: "lock@cube-software.com", password: "another-pass-77" } });
  assert.equal(locked.status, 401);
  assert.match((await locked.json()).error, /locked/);
});

test("blog posts: create, validate, publish", async () => {
  const cookie = await signIn();
  const post = { slug: "hello-cube", title: "Hello from Cube", category: "News", icon: "Newspaper", excerpt: "A short test excerpt.", body: ["First paragraph.", { h: "Heading" }, { list: ["One"] }] };
  assert.equal((await api("/api/admin/posts", { method: "POST", cookie, body: { ...post, slug: "../etc/passwd" } })).status, 400);
  assert.equal((await api("/api/admin/posts", { method: "POST", cookie, body: { ...post, cover: "javascript:alert(1)" } })).status, 400);
  assert.equal((await api("/api/admin/posts", { method: "POST", cookie, body: post })).status, 201);
  assert.equal((await api("/api/admin/posts", { method: "POST", cookie, body: post })).status, 409);
  const pub = await (await api("/api/posts/hello-cube")).json();
  assert.equal(pub.post.title, "Hello from Cube");
  assert.deepEqual(pub.post.body, post.body);
  assert.equal((await api("/api/posts/does-not-exist")).status, 404);
});

test("uploads: images and videos only, checked by their real bytes after the direct upload", async () => {
  const cookie = await signIn();
  const sign = (type, size) => api("/api/admin/media/sign", { method: "POST", cookie, body: { type, size } });
  const confirm = (file, name = "x") => api("/api/admin/media/confirm", { method: "POST", cookie, body: { file, name } });
  // Upload in two steps, putting `bytes` where the browser would have.
  const upload = async (type, bytes, name) => {
    const s = await (await sign(type, bytes.length)).json();
    assert.match(s.uploadUrl, /upload\/sign\/media\/[a-f0-9]{24}\./);
    stored.set(s.file, bytes);
    return [s.file, await confirm(s.file, name)];
  };
  assert.equal((await sign("image/svg+xml", 100)).status, 400);
  assert.equal((await sign("text/html", 100)).status, 400);
  assert.equal((await sign("image/png", 11 * 1024 * 1024)).status, 400); // images up to 10 MB
  assert.equal((await sign("video/mp4", 60 * 1024 * 1024)).status, 400); // video up to 50 MB
  assert.equal((await sign("video/mp4", 30 * 1024 * 1024)).status, 200);
  // A script uploaded under an image's name is caught and deleted.
  const [fake, bad] = await upload("image/png", Buffer.from("<html><script>alert(1)</script></html>"));
  assert.equal(bad.status, 400);
  assert.ok(!stored.has(fake));
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(32)]);
  const [pngFile, ok] = await upload("image/png", png, "../../evil.php");
  assert.equal(ok.status, 201);
  assert.match((await ok.json()).url, /\/storage\/v1\/object\/public\/media\/[a-f0-9]{24}\.png$/);
  assert.equal((await confirm(pngFile)).status, 409); // can't be added twice
  const mp4 = Buffer.concat([Buffer.from([0, 0, 0, 0x20]), Buffer.from("ftypisom"), Buffer.alloc(40)]);
  assert.equal((await upload("video/mp4", mp4))[1].status, 201);
  const mov = Buffer.concat([Buffer.from([0, 0, 0, 0x20]), Buffer.from("ftypqt  "), Buffer.alloc(40)]);
  assert.equal((await upload("video/mp4", mov))[1].status, 400); // QuickTime needs converting to MP4
  assert.equal((await confirm("../../etc/passwd")).status, 400);
  const { media } = await (await api("/api/admin/media", { cookie })).json();
  assert.equal(media.length, 2);
  for (const m of media) assert.equal((await api(`/api/admin/media/${m.id}`, { method: "DELETE", cookie })).status, 200);
  assert.equal(stored.size, 0);
  assert.equal((await api("/api/admin/media/abc", { method: "DELETE", cookie })).status, 404);
});

test("admins: Auth users not on the admin list can't sign in; password changes go through Auth", async () => {
  await supabase.upsertUser("outsider@example.com", "outsider-pass-99");
  assert.equal((await api("/api/admin/login", { method: "POST", body: { email: "outsider@example.com", password: "outsider-pass-99" } })).status, 401);
  const cookie = await signIn();
  assert.equal((await api("/api/admin/password", { method: "POST", cookie, body: { current: "wrong", next: "new-strong-pass-1" } })).status, 400);
  assert.equal((await api("/api/admin/password", { method: "POST", cookie, body: { current: "correct-horse-42", next: "new-strong-pass-1" } })).status, 200);
  assert.equal((await api("/api/admin/password", { method: "POST", cookie, body: { current: "new-strong-pass-1", next: "correct-horse-42" } })).status, 200);
  assert.equal((await api("/api/admin/admins", { method: "POST", cookie, body: { email: "second@cube-software.com", password: "second-pass-123" } })).status, 201);
  assert.equal((await api("/api/admin/admins", { method: "POST", cookie, body: { email: "SECOND@cube-software.com", password: "second-pass-123" } })).status, 409);
});

test("admin calendar: block and reopen a slot, add one, close a day; bookings record the terms version", async () => {
  const cookie = await signIn();
  const open = (await (await api("/api/availability?days=14")).json()).slots;
  const target = open[open.length - 1];
  const date = slots.istDate(Date.parse(target));
  assert.equal((await api("/api/admin/slot-rules", { method: "PUT", cookie, body: { start: target, action: "block" } })).status, 200);
  assert.ok(!(await (await api("/api/availability?days=14")).json()).slots.includes(target));
  const sched = await (await api(`/api/admin/schedule?from=${date}&days=1`, { cookie })).json();
  assert.equal(sched.days[0].slots.find((s) => s.start === target).state, "blocked");
  assert.equal((await api("/api/bookings", { method: "POST", body: { ...person, slot: target, timezone: "Asia/Kolkata" } })).status, 409);
  assert.equal((await api("/api/admin/slot-rules", { method: "PUT", cookie, body: { start: target, action: null } })).status, 200);
  assert.ok((await (await api("/api/availability?days=14")).json()).slots.includes(target));
  // Add a slot 5 minutes after the last one (off the normal grid).
  const added = new Date(Date.parse(target) + 5 * 60_000).toISOString();
  assert.equal((await api("/api/admin/slot-rules", { method: "PUT", cookie, body: { start: added, action: "open" } })).status, 200);
  assert.ok((await (await api("/api/availability?days=14")).json()).slots.includes(added));
  assert.equal((await api("/api/admin/slot-rules", { method: "PUT", cookie, body: { start: "2001-01-01T04:00:00.000Z", action: "open" } })).status, 400);
  assert.equal((await api("/api/admin/slot-rules", { method: "PUT", cookie, body: { start: "x'; DROP TABLE slot_rules;--", action: "block" } })).status, 400);
  // Closing the day hides its regular slots but keeps the slot the admin added by hand.
  assert.equal((await api(`/api/admin/days/${date}`, { method: "PUT", cookie, body: { closed: true } })).status, 200);
  const closed = (await (await api("/api/availability?days=14")).json()).slots.filter((s) => slots.istDate(Date.parse(s)) === date);
  assert.deepEqual(closed, [added]);
  assert.equal((await api(`/api/admin/days/${date}`, { method: "PUT", cookie, body: { closed: false } })).status, 200);
  const booked = await api("/api/bookings", { method: "POST", body: { ...person, email: "terms@example.com", slot: added, timezone: "Asia/Kolkata" } });
  assert.equal(booked.status, 201);
  const row = await db.get("SELECT terms_version, consent_at FROM bookings WHERE email = ?", "terms@example.com");
  assert.match(row.terms_version, /Terms .* Privacy/);
  assert.ok(row.consent_at);
  const consents = await (await api("/api/admin/consents", { cookie })).json();
  assert.ok(consents.totals.total >= 1);
  assert.ok(Array.isArray(consents.records));
});

test("sign-in needs the authenticator code: the password alone, a wrong code or a missing header gets nowhere", async () => {
  await signIn(); // make sure admin@ is enrolled
  const secret = secrets.get("admin@cube-software.com");
  const step1 = await api("/api/admin/login", { method: "POST", body: { email: "admin@cube-software.com", password: "correct-horse-42" } });
  assert.equal((await step1.json()).step, "totp");
  const pending = cookieFrom(step1);
  assert.ok(!pending.includes("cube_admin="));
  assert.equal((await api("/api/admin/leads", { cookie: pending })).status, 401); // pending sign-in is not a session
  const real = totp.generate(secret);
  const wrong = real === "000000" ? "111111" : "000000";
  assert.equal((await api("/api/admin/login/code", { method: "POST", cookie: pending, body: { code: "' OR 1=1 --" } })).status, 401);
  for (let i = 0; i < 4; i++) await api("/api/admin/login/code", { method: "POST", cookie: pending, body: { code: wrong } });
  // Five wrong codes end that sign-in, even with the right code afterwards.
  const late = await api("/api/admin/login/code", { method: "POST", cookie: pending, body: { code: totp.generate(secret) } });
  assert.equal(late.status, 401);
  assert.equal((await late.json()).restart, true);
  assert.equal((await api("/api/admin/login", { method: "POST", csrf: false, body: { email: "admin@cube-software.com", password: "correct-horse-42" } })).status, 403);
  const failed = await db.get("SELECT COUNT(*)::int n FROM audit_log WHERE action = 'login_code_failed'");
  assert.ok(failed.n >= 5);
});

test("sessions: browser-session cookie, end after 30 minutes idle, sign out everywhere", async () => {
  await signIn(); // enrol admin@ and remember its secret
  const secret = secrets.get("admin@cube-software.com");
  const step1 = await api("/api/admin/login", { method: "POST", body: { email: "admin@cube-software.com", password: "correct-horse-42" } });
  const step2 = await api("/api/admin/login/code", { method: "POST", cookie: cookieFrom(step1), body: { code: totp.generate(secret) } });
  const raw = step2.headers.getSetCookie().find((c) => c.startsWith("cube_admin="));
  assert.match(raw, /HttpOnly/i);
  assert.match(raw, /SameSite=Strict/i);
  assert.doesNotMatch(raw, /Expires|Max-Age/i);
  const cookie = raw.split(";")[0];
  assert.equal((await api("/api/admin/me", { cookie })).status, 200);
  await db.run("UPDATE sessions SET last_seen = ?", Date.now() - 31 * 60_000);
  assert.equal((await api("/api/admin/me", { cookie })).status, 401);
  const a = await signIn();
  const b = await signIn();
  assert.equal((await api("/api/admin/logout-all", { method: "POST", cookie: a })).status, 200);
  assert.equal((await api("/api/admin/me", { cookie: b })).status, 401);
  const log = await (await api("/api/admin/audit", { cookie: await signIn() })).json();
  assert.ok(log.entries.some((e) => e.action === "login_ok"));
  assert.ok(log.entries.some((e) => e.action === "change" && e.detail === "POST /logout-all"));
});

test("automatic deletion: old consents, page views, logs, enquiries and expired sessions are removed", async () => {
  const { sweep } = require("../src/retention");
  await db.run("INSERT INTO consents (id, functional, analytics, marketing, version, updated_at) VALUES (?, false, false, false, '1', now() - interval '14 months')", crypto.randomUUID());
  await db.run("INSERT INTO page_views (path, at) VALUES ('/old', now() - interval '14 months')");
  await db.run("INSERT INTO page_views (path) VALUES ('/new')");
  await db.run("INSERT INTO audit_log (action, at) VALUES ('old', now() - interval '13 months')");
  await db.run("INSERT INTO leads (name, email, phone, consent_at, created_at) VALUES ('Old', 'old@example.com', '9999999', now(), now() - interval '40 months')");
  const done = await sweep(db);
  assert.ok(done.consents >= 1 && done.pageViews === 1 && done.auditLog >= 1 && done.leads === 1);
  assert.equal((await db.get("SELECT COUNT(*)::int n FROM page_views WHERE path = '/new'")).n, 1);
});

test("privacy requests: find everything for an email, then erase it", async () => {
  const cookie = await signIn();
  await api("/api/leads", { method: "POST", body: { ...person, email: "erase.me@example.com" } });
  const found = await (await api("/api/admin/privacy?email=ERASE.ME@example.com", { cookie })).json();
  assert.equal(found.leads.length, 1);
  assert.equal((await api("/api/admin/privacy?email=x' OR '1'='1", { cookie })).status, 400);
  const erased = await (await api("/api/admin/privacy/erase", { method: "POST", cookie, body: { email: "erase.me@example.com" } })).json();
  assert.equal(erased.leads, 1);
  assert.equal((await (await api("/api/admin/privacy?email=erase.me@example.com", { cookie })).json()).leads.length, 0);
  const entry = await db.get("SELECT detail FROM audit_log WHERE action = 'privacy_erase'");
  assert.ok(!entry.detail.includes("erase.me")); // the log doesn't keep whose data it was
});

test("analytics: page views are stored without identifiers; admin pages and bots are ignored", async () => {
  const pv = (body, ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604.1") =>
    fetch(base + "/api/pv", { method: "POST", headers: { "Content-Type": "application/json", "User-Agent": ua }, body: JSON.stringify(body) });
  assert.equal((await pv({ path: "/pricing", ref: "google.com" })).status, 204);
  await pv({ path: "/admin/leads" });
  await pv({ path: "/pricing" }, "Googlebot/2.1");
  await pv({ path: "javascript:alert(1)" });
  const rows = await db.all("SELECT * FROM page_views WHERE path <> '/new'");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].device, "Mobile");
  assert.equal(rows[0].referrer, "google.com");
  assert.equal(rows[0].ip, "");
  const cookie = await signIn();
  const stats = await (await api("/api/admin/analytics?days=30", { cookie })).json();
  assert.ok(stats.pages.some((p) => p.label === "/pricing"));
  // Visitor details only when switched on in the dashboard AND the visitor allowed it after being told (ip: true).
  await pv({ path: "/about", ip: true });
  assert.equal((await db.get("SELECT ip FROM page_views WHERE path = '/about'")).ip, "");
  assert.equal((await api("/api/admin/settings/visitorTracking", { method: "PUT", cookie, body: { value: { on: true } } })).status, 200);
  await fetch(base + "/api/pv", { method: "POST", headers: { "Content-Type": "application/json", "x-vercel-ip-city": "New%20Delhi", "x-vercel-ip-country": "IN" }, body: JSON.stringify({ path: "/contact", ip: true }) });
  await pv({ path: "/careers" }); // no ip: true from the browser, so nothing personal
  const row = await db.get("SELECT ip, city, country FROM page_views WHERE path = '/contact'");
  assert.ok(row.ip.length > 0);
  assert.deepEqual([row.city, row.country], ["New Delhi", "IN"]);
  assert.equal((await db.get("SELECT ip FROM page_views WHERE path = '/careers'")).ip, "");
  const report = await (await api("/api/admin/analytics?days=30", { cookie })).json();
  assert.ok(report.tracking && report.visitors.some((v) => v.city === "New Delhi"));
  assert.ok(report.cities.some((c) => c.label === "New Delhi"));
  await api("/api/admin/settings/visitorTracking", { method: "PUT", cookie, body: { value: { on: false } } });
  await db.run("DELETE FROM page_views WHERE path IN ('/about', '/contact', '/careers')");
});

test("team and social links: validated, stripped to known fields, served to the site", async () => {
  const cookie = await signIn();
  assert.deepEqual(await (await api("/api/site")).json(), { team: null, socials: null, nav: null, bot: null, fonts: null, festival: null, pagesOff: null, sectionsOff: null, pricing: null, google: null, tracking: false });
  const put = (key, value) => api(`/api/admin/settings/${key}`, { method: "PUT", cookie, body: { value } });
  assert.equal((await put("team", [{ name: "A", linkedin: "javascript:alert(1)" }])).status, 400);
  assert.equal((await put("team", [{ name: "A", image: "javascript:alert(1)" }])).status, 400);
  assert.equal((await put("socials", { instagram: "http://insecure.example" })).status, 400);
  assert.equal((await put("socials", { tiktok: "https://x.y" })).status, 400);
  assert.equal((await put("team", [{ name: " Asha ", role: "CTO", image: "/a.webp", linkedin: "https://www.linkedin.com/in/asha", isAdmin: true }])).status, 200);
  assert.equal((await put("socials", { instagram: "https://www.instagram.com/cube/" })).status, 200);
  const site = await (await api("/api/site")).json();
  assert.deepEqual(site.team, [{ name: "Asha", role: "CTO", image: "/a.webp", bio: "", linkedin: "https://www.linkedin.com/in/asha" }]);
  assert.equal(site.socials.instagram, "https://www.instagram.com/cube/");
  assert.equal(site.socials.facebook, "");
});

test("authenticator enrolment: first sign-in returns a QR secret and binds it; reset forces re-enrolment", async () => {
  await addAdmin("enrol@cube-software.com", "enrol-pass-123");
  const step1 = await api("/api/admin/login", { method: "POST", body: { email: "enrol@cube-software.com", password: "enrol-pass-123" } });
  const r = await step1.json();
  assert.equal(r.step, "totp_setup");
  assert.match(r.otpauth, /^otpauth:\/\/totp\//);
  assert.ok(r.secret && r.secret.length >= 16);
  const pending = cookieFrom(step1);
  // A wrong code doesn't complete enrolment; the right one does and signs in.
  assert.equal((await api("/api/admin/login/code", { method: "POST", cookie: pending, body: { code: "000000" } })).status, 401);
  const ok = await api("/api/admin/login/code", { method: "POST", cookie: pending, body: { code: totp.generate(r.secret) } });
  assert.equal(ok.status, 200);
  // The secret is stored encrypted, not in the clear.
  const rowAfter = await db.get("SELECT totp_secret FROM admins WHERE email = ?", "enrol@cube-software.com");
  assert.ok(rowAfter.totp_secret && rowAfter.totp_secret.startsWith("v1:") && !rowAfter.totp_secret.includes(r.secret));
  // Next sign-in is just the code (no new QR).
  secrets.set("enrol@cube-software.com", r.secret);
  const step1b = await api("/api/admin/login", { method: "POST", body: { email: "enrol@cube-software.com", password: "enrol-pass-123" } });
  assert.equal((await step1b.json()).step, "totp");
  // Reset clears it, so the next sign-in enrols again.
  await db.run("UPDATE admins SET totp_secret = NULL WHERE email = ?", "enrol@cube-software.com");
  const step1c = await api("/api/admin/login", { method: "POST", body: { email: "enrol@cube-software.com", password: "enrol-pass-123" } });
  assert.equal((await step1c.json()).step, "totp_setup");
});

test("owner: the first admin can't be removed, and only the owner manages admins", async () => {
  const owner = await signIn();
  assert.equal((await (await api("/api/admin/me", { cookie: owner })).json()).admin.isOwner, true);
  await api("/api/admin/admins", { method: "POST", cookie: owner, body: { email: "helper@cube-software.com", password: "helper-pass-123" } });
  const helper = await signIn("helper@cube-software.com", "helper-pass-123");
  // A regular admin sees only their own account.
  assert.deepEqual((await (await api("/api/admin/admins", { cookie: helper })).json()).admins.map((a) => a.email), ["helper@cube-software.com"]);
  const { admins } = await (await api("/api/admin/admins", { cookie: owner })).json();
  const ownerRow = admins.find((a) => a.is_owner);
  assert.equal(ownerRow.email, "admin@cube-software.com");
  assert.equal((await api(`/api/admin/admins/${ownerRow.id}`, { method: "DELETE", cookie: helper })).status, 403);
  assert.equal((await api("/api/admin/admins", { method: "POST", cookie: helper, body: { email: "x@cube-software.com", password: "x-password-123" } })).status, 403);
  // Even straight in the database, the owner can't be deleted or demoted.
  await assert.rejects(db.run("DELETE FROM admins WHERE is_owner"));
  await assert.rejects(db.run("UPDATE admins SET is_owner = false WHERE is_owner"));
  const helperRow = admins.find((a) => a.email === "helper@cube-software.com");
  assert.equal((await api(`/api/admin/admins/${helperRow.id}`, { method: "DELETE", cookie: owner })).status, 200);
});

test("image edits remember the size of the spot they fill", async () => {
  const cookie = await signIn();
  await api("/api/admin/overrides", { method: "POST", cookie, body: { kind: "image", scope: "/", original: "/a.png", replacement: "/b.png", width: 640, height: 360 } });
  await api("/api/admin/overrides", { method: "POST", cookie, body: { kind: "image", scope: "/", original: "/c.png", replacement: "/d.png", width: "1e9", height: -5 } });
  const { overrides } = await (await api("/api/content")).json();
  const a = overrides.find((o) => o.original === "/a.png");
  const c = overrides.find((o) => o.original === "/c.png");
  assert.deepEqual([a.width, a.height], [640, 360]);
  assert.deepEqual([c.width, c.height], [0, 0]);
});

test("a phone number edited for every page is used by the server too, in any format", async () => {
  const cookie = await signIn();
  const edit = (scope, original, replacement) => api("/api/admin/overrides", { method: "POST", cookie, body: { kind: "text", scope, original, replacement } });
  assert.equal(await settings.editedPhone(db, "+91-80-6869-4440"), "+91-80-6869-4440"); // not edited: as written
  await edit("/about", "+91 80 68 69 44 40", "+91 11 11 11 11 11");
  assert.equal(await settings.editedPhone(db, "+91-80-6869-4440"), "+91-80-6869-4440"); // one page's edit doesn't count
  await edit("*", "Sales team", "+91 22 22 22 22 22");
  assert.equal(await settings.editedPhone(db, "+91-80-6869-4440"), "+91-80-6869-4440"); // only an edit of the number
  await edit("*", "+91 80 68 69 44 40", "+91 80 68 69 48 48");
  assert.equal(await settings.editedPhone(db, "+91-80-6869-4440"), "+91 80 68 69 48 48");
  assert.equal(await settings.editedPhone(db, "+91 806 869 4440"), "+91 80 68 69 48 48");
  await db.run("DELETE FROM overrides");
});

test("removing something from the site is saved as an edit that can be undone", async () => {
  const cookie = await signIn();
  const original = "hide:card:t:Missed Call Service";
  assert.equal((await api("/api/admin/overrides", { method: "POST", cookie, body: { kind: "image", scope: "*", original, replacement: "" } })).status, 200);
  assert.ok((await (await api("/api/content")).json()).overrides.some((o) => o.original === original && o.replacement === ""));
  const row = (await (await api("/api/admin/overrides", { cookie })).json()).overrides.find((o) => o.original === original);
  assert.equal((await api(`/api/admin/overrides/${row.id}`, { method: "DELETE", cookie })).status, 200);
  assert.ok(!(await (await api("/api/content")).json()).overrides.some((o) => o.original === original));
});

test("access: the owner picks what each admin can open; the activity log is owner-only", async () => {
  const owner = await signIn();
  await api("/api/admin/admins", { method: "POST", cookie: owner, body: { email: "editor@cube-software.com", password: "editor-pass-123", permissions: ["blog"] } });
  const editor = await signIn("editor@cube-software.com", "editor-pass-123");
  const me = (await (await api("/api/admin/me", { cookie: editor })).json()).admin;
  assert.deepEqual(me.permissions, ["blog"]);
  assert.equal((await api("/api/admin/posts", { cookie: editor })).status, 200);
  assert.equal((await api("/api/admin/media", { cookie: editor })).status, 200); // blog editors pick pictures
  for (const path of ["/api/admin/leads", "/api/admin/bookings", "/api/admin/privacy?email=a@b.co", "/api/admin/analytics", "/api/admin/audit", "/api/admin/pages"]) {
    assert.equal((await api(path, { cookie: editor })).status, 403, path);
  }
  assert.deepEqual(await (await api("/api/admin/settings", { cookie: editor })).json(), {}); // no settings sections
  assert.equal((await api("/api/admin/settings/salesEmails", { method: "PUT", cookie: editor, body: { value: ["x@cube-software.com"] } })).status, 403);
  const { admins } = await (await api("/api/admin/admins", { cookie: owner })).json();
  const row = admins.find((a) => a.email === "editor@cube-software.com");
  // Only the owner changes access, only to known sections, and never the owner's own.
  assert.equal((await api(`/api/admin/admins/${row.id}/permissions`, { method: "PUT", cookie: editor, body: { permissions: ["leads"] } })).status, 403);
  assert.equal((await api(`/api/admin/admins/${row.id}/permissions`, { method: "PUT", cookie: owner, body: { permissions: ["root"] } })).status, 400);
  assert.equal((await api(`/api/admin/admins/${admins.find((a) => a.is_owner).id}/permissions`, { method: "PUT", cookie: owner, body: { permissions: [] } })).status, 400);
  assert.equal((await api(`/api/admin/admins/${row.id}/permissions`, { method: "PUT", cookie: owner, body: { permissions: ["leads"] } })).status, 200);
  assert.equal((await api("/api/admin/leads", { cookie: editor })).status, 200); // takes effect at once
  assert.equal((await api("/api/admin/posts", { cookie: editor })).status, 403);
  const log = await (await api("/api/admin/audit", { cookie: owner })).json();
  assert.ok(log.entries.some((e) => e.action === "permissions_changed" && e.detail.includes("editor@")));
});

test("card lists: validated per kind, stripped to known fields, served with the site edits", async () => {
  const cookie = await signIn();
  const put = (body) => api("/api/admin/lists", { method: "PUT", cookie, body });
  const product = { title: "Co-Browsing", tag: "Support", tagline: "See it together.", img: "/products/co-browsing.svg", href: "/services/co-browsing" };
  assert.equal((await put({ scope: "*", key: "products:abc123", items: [{ ...product, href: "javascript:alert(1)" }] })).status, 400);
  assert.equal((await put({ scope: "*", key: "products:abc123", items: [{ ...product, img: "data:text/html,x" }] })).status, 400);
  assert.equal((await put({ scope: "*", key: "nope:abc", items: [] })).status, 400);
  assert.equal((await put({ scope: "/a'b", key: "faq:abc", items: [] })).status, 400);
  assert.equal((await put({ scope: "*", key: "products:abc123", items: [{ ...product, onClick: "x" }] })).status, 200);
  assert.equal((await put({ scope: "/services/x", key: "features:z9", items: [{ icon: "Mic", title: "One", desc: "Text" }] })).status, 200);
  assert.equal((await put({ scope: "/services/x", key: "features:z9", items: [{ icon: "<img>", title: "One" }] })).status, 400);
  const { lists } = await (await api("/api/content")).json();
  assert.deepEqual(lists.find((l) => l.key === "products:abc123").items, [product]);
  // Custom cards: any declared fields, with icons, links and pictures checked; nothing but text, on/off and lists.
  const custom = { icon: "Mic", title: "IVR", desc: "Menus", path: "/services/ivr", bullets: ["One", " ", "Two"], highlight: true };
  assert.equal((await put({ scope: "*", key: "card:q1", items: [{ ...custom, path: "javascript:alert(1)" }] })).status, 400);
  assert.equal((await put({ scope: "*", key: "card:q1", items: [{ ...custom, image: "data:text/html,x" }] })).status, 400);
  assert.equal((await put({ scope: "*", key: "card:q1", items: [{ ...custom, icon: "<img>" }] })).status, 400);
  assert.equal((await put({ scope: "*", key: "card:q1", items: [{ ...custom, title: { $ne: 1 } }] })).status, 400);
  assert.equal((await put({ scope: "*", key: "card:q1", items: [{ icon: "Mic" }] })).status, 400); // no content
  assert.equal((await put({ scope: "*", key: "card:q1", items: [{ ...custom, href: "tel:+91 80 68 69 48 48" }] })).status, 200);
  const saved = (await (await api("/api/content")).json()).lists.find((l) => l.key === "card:q1").items[0];
  assert.deepEqual(saved.bullets, ["One", "Two"]);
  assert.equal(saved.highlight, true);
  const { lists: mine } = await (await api("/api/admin/lists", { cookie })).json();
  for (const l of mine) assert.equal((await api(`/api/admin/lists/${l.id}`, { method: "DELETE", cookie })).status, 200);
});

test("pages built in the dashboard: validated, can't take over existing addresses, live only when published", async () => {
  const cookie = await signIn();
  const page = {
    path: "/services/test-page",
    title: "Test page | Cube Software",
    description: "A page made in the dashboard.",
    published: false,
    content: {
      hero: { label: "Support", title: "Hello", body: ["Intro."] },
      sections: [{ title: "Why", cards: [{ icon: "Mic", title: "Card", desc: "Text" }], list: ["One"], steps: false }],
      cta: { title: "Talk to us", body: ["Now."], button: "Book a demo" },
    },
  };
  const post = (body) => api("/api/admin/pages", { method: "POST", cookie, body });
  assert.equal((await post({ ...page, path: "/admin/x" })).status, 400);
  assert.equal((await post({ ...page, path: "/about" })).status, 400); // a page the site already has
  assert.equal((await post({ ...page, path: "/Services/../x" })).status, 400);
  assert.equal((await post({ ...page, content: { ...page.content, hero: { ...page.content.hero, image: "javascript:alert(1)" } } })).status, 400);
  const created = await post(page);
  assert.equal(created.status, 201);
  assert.equal((await post(page)).status, 409);
  assert.equal((await api("/api/page?path=/services/test-page")).status, 404); // not published yet
  const { id } = await created.json();
  assert.equal((await api(`/api/admin/pages/${id}`, { method: "PUT", cookie, body: { ...page, published: true } })).status, 200);
  const live = (await (await api("/api/page?path=/services/test-page")).json()).page;
  assert.equal(live.content.sections[0].cards[0].title, "Card");
  assert.equal(live.content.related, false);
  assert.match(await (await api("/sitemap.xml")).text(), /\/services\/test-page/);
  assert.equal((await api(`/api/admin/pages/${id}`, { method: "DELETE", cookie })).status, 200);
  assert.equal((await api("/api/page?path=/services/test-page")).status, 404);
});

test("pages keep the parts copied from existing pages: numbers, animation, tiles, questions, dark band", async () => {
  const cookie = await signIn();
  const page = (hero, section) => ({ path: "/copied-page", title: "Copied page", description: "", published: true, content: { hero: { title: "Hello", ...hero }, sections: [{ title: "Why", ...section }], cta: null } });
  const post = (body) => api("/api/admin/pages", { method: "POST", cookie, body });
  assert.equal((await post(page({ scene: "<script>" }))).status, 400);
  assert.equal((await post(page({ stats: [{ label: "no value" }] }))).status, 400);
  assert.equal((await post(page({}, { faqs: [{ q: "No answer" }] }))).status, 400);
  assert.equal((await post(page({}, { tiles: [{ icon: "bad icon!", label: "x" }] }))).status, 400);
  const created = await post(page(
    { scene: "missed-call", stats: [{ value: "35+", label: "Years", extra: "dropped" }], tiles: [{ icon: "Mic", label: "Capture" }] },
    { dark: true, numbered: ["One", "Two"], faqs: [{ q: "Why?", a: "Because." }], tiles: [{ icon: "Cloud", label: "Store" }] }
  ));
  assert.equal(created.status, 201);
  const { hero, sections } = (await (await api("/api/page?path=/copied-page")).json()).page.content;
  assert.equal(hero.scene, "missed-call");
  assert.deepEqual(hero.stats, [{ value: "35+", label: "Years" }]);
  assert.deepEqual(sections[0].faqs, [{ q: "Why?", a: "Because." }]);
  assert.deepEqual(sections[0].numbered, ["One", "Two"]);
  assert.equal(sections[0].dark, true);
  assert.equal((await api(`/api/admin/pages/${(await created.json()).id}`, { method: "DELETE", cookie })).status, 200);
});

test("navigation bar: validated, stripped to known fields, served to the site; needs its own access", async () => {
  const owner = await signIn();
  const put = (value, cookie = owner) => api("/api/admin/settings/nav", { method: "PUT", cookie, body: { value } });
  const link = { label: "Screen Logger", desc: "Screens.", href: "/services/screen-logger", icon: "Mic" };
  const option = { label: "Record", icon: "Mic", featured: null, links: [link] };
  const menu = { label: "Solutions", layout: "simple", extras: false, groups: [option] };
  const nav = (items) => ({ items, expert: true, demo: false });
  for (const bad of [
    null,
    { items: [] },
    nav(Array.from({ length: 9 }, () => ({ label: "A", href: "/a" }))),
    nav([{ label: "", href: "/a" }]),
    nav([{ label: "A" }]), // goes nowhere
    nav([{ label: "A", href: "javascript:alert(1)" }]),
    nav([{ ...menu, layout: "unknown" }]),
    nav([{ ...menu, groups: [] }]),
    nav([{ ...menu, groups: [{ ...option, label: "" }] }]),
    nav([{ ...menu, groups: [{ ...option, icon: "<b>" }] }]),
    nav([{ ...menu, groups: [{ ...option, featured: { title: "T", href: "javascript:alert(1)" } }] }]),
    nav([{ ...menu, groups: [{ ...option, links: [{ ...link, href: "javascript:alert(1)" }] }] }]),
    nav([{ ...menu, groups: [{ ...option, links: [{ ...link, href: "" }] }] }]),
  ]) assert.equal((await put(bad)).status, 400, JSON.stringify(bad));

  const ok = nav([{ label: " Features ", href: "/#features", extra: "dropped" }, { ...menu, extra: "dropped", groups: [{ ...option, extra: "dropped", links: [{ ...link, extra: "dropped" }, { label: "Call us", href: "tel:+911204057109" }, { label: "Partner", href: "https://example.com/x" }] }] }]);
  assert.equal((await put(ok)).status, 200);
  const saved = (await (await api("/api/site")).json()).nav;
  assert.deepEqual(saved.items[0], { label: "Features", href: "/#features" });
  assert.deepEqual(saved.items[1].groups[0].links[0], link);
  assert.equal(saved.items[1].groups[0].extra, undefined);
  assert.equal(saved.items[1].extra, undefined);
  assert.equal(saved.demo, false);
  assert.equal(saved.expert, true);

  // Another admin can change it only when the owner gives them the section.
  await api("/api/admin/admins", { method: "POST", cookie: owner, body: { email: "navigator@cube-software.com", password: "Long-enough-pass-1", permissions: ["blog"] } });
  const editor = await signIn("navigator@cube-software.com", "Long-enough-pass-1");
  assert.equal((await put(ok, editor)).status, 403);
  const { admins } = await (await api("/api/admin/admins", { cookie: owner })).json();
  const id = admins.find((a) => a.email === "navigator@cube-software.com").id;
  assert.equal((await api(`/api/admin/admins/${id}/permissions`, { method: "PUT", cookie: owner, body: { permissions: ["navigation"] } })).status, 200);
  assert.equal((await put(ok, editor)).status, 200);
  await api(`/api/admin/admins/${id}`, { method: "DELETE", cookie: owner });
  await db.run("DELETE FROM settings WHERE key = 'nav'");
});

test("font sizes, festivals, switched-off pages and the bot: validated, cleaned, served to the site, each with its own access", async () => {
  const owner = await signIn();
  const put = (key, value, cookie = owner) => api(`/api/admin/settings/${key}`, { method: "PUT", cookie, body: { value } });
  const site = async () => (await api("/api/site")).json();

  for (const bad of [{ all: 100 }, { all: 500, head: 100, body: 100, nav: 100 }, { all: "100", head: 100, body: 100, nav: 100 }]) assert.equal((await put("fonts", bad)).status, 400);
  assert.equal((await put("fonts", { all: 110, head: 120, body: 100, nav: 95, extra: 1 })).status, 200);
  assert.deepEqual((await site()).fonts, { all: 110, head: 120, body: 100, nav: 95 });

  for (const bad of [{ active: "halloween", greetings: {} }, { active: "diwali" }, { active: "diwali", greetings: { nope: "x" } }, { active: "diwali", greetings: { diwali: "x".repeat(141) } }]) assert.equal((await put("festival", bad)).status, 400);
  assert.equal((await put("festival", { active: "diwali", scroll: false, greetings: { diwali: " Happy Diwali ", holi: "  " }, extra: 1 })).status, 200);
  assert.deepEqual((await site()).festival, { active: "diwali", scroll: false, effects: true, popup: true, greetings: { diwali: "Happy Diwali" } });
  assert.equal((await put("festival", { active: null, greetings: {} })).status, 200);

  for (const bad of [{ paths: ["javascript:x"] }, { paths: "about" }, { paths: ["/about"], title: "x".repeat(121) }]) assert.equal((await put("pagesOff", bad)).status, 400);
  assert.match(await (await api("/sitemap.xml")).text(), /\/about</);
  assert.equal((await put("pagesOff", { paths: ["/about", "/about", "/pricing"], title: " Back soon ", message: "" })).status, 200);
  assert.deepEqual((await site()).pagesOff, { paths: ["/about", "/pricing"], title: "Back soon", message: "" });
  const map = await (await api("/sitemap.xml")).text();
  assert.doesNotMatch(map, /\/about</);
  assert.match(map, /\/contact</);

  const bot = { enabled: true, status: "Online", title: "Hi", subtitle: "", questionsTitle: "Questions", bubbles: { default: "a", pricing: "b", services: "c", industries: "d" }, actions: [{ label: "Demo", sub: "", icon: "Mic", href: "demo:" }, { label: "Call", sub: "", icon: "Phone", href: "tel:+911204057109", extra: 1 }], faqs: [{ q: "Q?", a: "A." }] };
  for (const bad of [
    { ...bot, title: "" },
    { ...bot, bubbles: { default: "a" } },
    { ...bot, actions: [{ label: "Bad", href: "javascript:alert(1)" }] },
    { ...bot, actions: [{ label: "Bad", href: "chat:" }] },
    { ...bot, actions: [{ label: "", href: "/contact" }] },
    { ...bot, faqs: [{ q: "No answer" }] },
  ]) assert.equal((await put("bot", bad)).status, 400);
  assert.equal((await put("bot", bot)).status, 200);
  const savedBot = (await site()).bot;
  assert.equal(savedBot.actions[1].extra, undefined);
  assert.equal(savedBot.actions[1].href, "tel:+911204057109");

  // One piece of text sized on its own: only a sensible percentage is accepted.
  const size = (replacement) => api("/api/admin/overrides", { method: "POST", cookie: owner, body: { kind: "image", scope: "/about", original: "size:Hello there", replacement } });
  assert.equal((await size("javascript:x")).status, 400);
  assert.equal((await size("999")).status, 400);
  assert.equal((await size("130")).status, 200);
  const { overrides } = await (await api("/api/admin/overrides", { cookie: owner })).json();
  assert.equal((await api(`/api/admin/overrides/${overrides.find((o) => o.original === "size:Hello there").id}`, { method: "DELETE", cookie: owner })).status, 200);

  // Another admin only with the owner's say-so.
  await api("/api/admin/admins", { method: "POST", cookie: owner, body: { email: "seasonal@cube-software.com", password: "Long-enough-pass-1", permissions: ["festivals"] } });
  const editor = await signIn("seasonal@cube-software.com", "Long-enough-pass-1");
  assert.equal((await put("festival", { active: "holi", greetings: {} }, editor)).status, 200);
  for (const [key, value] of [["fonts", { all: 100, head: 100, body: 100, nav: 100 }], ["pagesOff", { paths: [] }], ["bot", bot]]) assert.equal((await put(key, value, editor)).status, 403);
  const { admins } = await (await api("/api/admin/admins", { cookie: owner })).json();
  await api(`/api/admin/admins/${admins.find((a) => a.email === "seasonal@cube-software.com").id}`, { method: "DELETE", cookie: owner });
  for (const key of ["fonts", "festival", "pagesOff", "bot"]) await db.run("DELETE FROM settings WHERE key = ?", key);
});

test("security headers are set", async () => {
  const res = await api("/api/demo-info");
  assert.match(res.headers.get("content-security-policy"), /frame-ancestors 'self'/);
  assert.equal(res.headers.get("x-powered-by"), null);
  assert.equal((await api("/api/nope")).status, 404);
});

test("Google & SEO: validated, only the Analytics ID reaches the site, the ownership file answers only for its own name", async () => {
  const cookie = await signIn();
  const put = (value) => api("/api/admin/settings/google", { method: "PUT", cookie, body: { value } });
  assert.equal((await put({ gaId: "UA-12345" })).status, 400);
  assert.equal((await put({ gaId: "G-ABC<script>" })).status, 400);
  assert.equal((await put({ searchConsole: "../index.html" })).status, 400);
  assert.equal((await put({ reports: [{ name: "x", url: "https://evil.example/lookerstudio.google.com/reporting/1" }] })).status, 400);
  assert.equal((await put({ reports: [{ name: "x", url: "javascript:alert(1)" }] })).status, 400);
  const report = { name: " Visitors ", url: "https://lookerstudio.google.com/reporting/abc-123/page/p_1" };
  assert.equal((await put({ gaId: "G-ABC123XYZ", searchConsole: "google1a2b3c4d5e6f7a8b.html", reports: [report], extra: 1 })).status, 200);
  assert.deepEqual((await (await api("/api/site")).json()).google, { gaId: "G-ABC123XYZ" });
  assert.deepEqual((await (await api("/api/admin/settings", { cookie })).json()).google, { gaId: "G-ABC123XYZ", searchConsole: "google1a2b3c4d5e6f7a8b.html", googleMeta: "", bing: "", reports: [{ name: "Visitors", url: report.url }] });
  for (const p of ["/google1a2b3c4d5e6f7a8b.html", "/api/google1a2b3c4d5e6f7a8b.html"]) assert.equal(await (await api(p)).text(), "google-site-verification: google1a2b3c4d5e6f7a8b.html");
  assert.notEqual(await (await api("/google0000000000000000.html")).text(), "google-site-verification: google0000000000000000.html");
  assert.match((await api("/api/demo-info")).headers.get("content-security-policy"), /script-src 'self' https:\/\/www\.googletagmanager\.com;/);
});

test("demo requests wait for the team: confirm or decline sends the visitor's email; the status can't skip it", async () => {
  const cookie = await signIn();
  const slot = (await (await api("/api/availability?days=14")).json()).slots[3];
  assert.equal((await api("/api/bookings", { method: "POST", body: { ...person, email: "visitor@example.com", slot, timezone: "Asia/Kolkata", marketing: true } })).status, 201);
  const b = await db.get("SELECT * FROM bookings WHERE slot_start = ?", slot);
  assert.equal(b.status, "pending");
  assert.ok(b.marketing);
  assert.ok((await db.get("SELECT subscribed FROM contacts WHERE email = 'visitor@example.com'")).subscribed);
  // Still holds its slot while waiting.
  assert.ok(!(await (await api("/api/availability?days=14")).json()).slots.includes(slot));
  assert.equal((await api(`/api/admin/bookings/${b.id}`, { method: "PATCH", cookie, body: { status: "scheduled" } })).status, 409);
  const preview = await (await api(`/api/admin/bookings/${b.id}/email?confirm=1`, { cookie })).json();
  assert.match(preview.from, /info@cube-software\.com/);
  assert.match(preview.subject, /confirmed/);
  assert.match(preview.html, /\/unsubscribe\?e=/);
  assert.equal((await api(`/api/admin/bookings/${b.id}/decision`, { method: "POST", cookie, body: { confirm: true } })).status, 200);
  assert.equal((await db.get("SELECT status FROM bookings WHERE id = ?", b.id)).status, "scheduled");
  assert.equal((await api(`/api/admin/bookings/${b.id}/decision`, { method: "POST", cookie, body: { confirm: false } })).status, 409);
});

test("unsubscribe: only signed links work, it stops newsletters at once, and removal keeps just a hash", async () => {
  const cookie = await signIn();
  const mailing = require("../src/mailing");
  const link = new URL(mailing.unsubscribeUrl("visitor@example.com"));
  const e = link.searchParams.get("e");
  assert.equal((await api("/api/unsubscribe", { method: "POST", body: { e, t: "forged-signature-forged-signatur" } })).status, 400);
  assert.equal((await api("/api/unsubscribe", { method: "POST", body: { e: Buffer.from("other@example.com").toString("base64url"), t: link.searchParams.get("t") } })).status, 400);
  // One-click from a mail app: the address is in the link itself.
  assert.equal((await api(`/api/unsubscribe?${link.searchParams}`, { method: "POST", raw: "List-Unsubscribe=One-Click" })).status, 200);
  const c = await db.get("SELECT id, subscribed, unsubscribed_at FROM contacts WHERE email = 'visitor@example.com'");
  assert.equal(c.subscribed, false);
  assert.ok(c.unsubscribed_at);
  assert.equal((await api(`/api/admin/contacts/${c.id}`, { method: "DELETE", cookie })).status, 200);
  assert.equal(await db.get("SELECT 1 FROM contacts WHERE email = 'visitor@example.com'"), undefined);
  assert.ok(await db.get("SELECT 1 FROM email_suppressions WHERE email_hash = ?", mailing.hash("visitor@example.com")));
  // They can't be added back, by a form or in the dashboard.
  assert.equal((await api("/api/admin/contacts", { method: "POST", cookie, body: { email: "Visitor@Example.com", agreed: true } })).status, 409);
});

test("newsletters: validated, sent once to each subscribed person, with an unsubscribe link from the sender set in the dashboard", async () => {
  const cookie = await signIn();
  const sent = [];
  const mail = require("../src/mail");
  const realSend = mail.send;
  const realReady = mail.configured;
  mail.configured = true;
  mail.send = async (m) => sent.push(m);
  try {
    for (const email of ["a@example.com", "b@example.com"]) assert.equal((await api("/api/admin/contacts", { method: "POST", cookie, body: { email, agreed: true } })).status, 201);
    assert.equal((await api("/api/admin/contacts", { method: "POST", cookie, body: { email: "c@example.com" } })).status, 400); // agreement needed
    await api("/api/admin/contacts", { method: "POST", cookie, body: { email: "gone@example.com", agreed: true } });
    await db.run("UPDATE contacts SET subscribed = false WHERE email = 'gone@example.com'");
    assert.equal((await api("/api/admin/settings/emailSender", { method: "PUT", cookie, body: { value: { name: "Cube", bookings: "info@cube-software.com", promotions: "news@cube-software.com" } } })).status, 200);
    const bad = { subject: "Hi", content: { body: "x", buttonLabel: "Go", buttonUrl: "javascript:alert(1)" } };
    assert.equal((await api("/api/admin/campaigns", { method: "POST", cookie, body: bad })).status, 400);
    const { id } = await (await api("/api/admin/campaigns", { method: "POST", cookie, body: { subject: "New: Cube Voice Mail", content: { heading: "<b>Hello</b>", body: "First line\n\nSecond", buttonLabel: "See it", buttonUrl: "/services/voice-mail" } } })).json();
    const r = await (await api(`/api/admin/campaigns/${id}/send`, { method: "POST", cookie })).json();
    assert.equal(r.remaining, 0);
    assert.deepEqual(sent.map((m) => m.to).sort(), ["a@example.com", "b@example.com"]);
    assert.match(sent[0].from, /news@cube-software\.com/);
    assert.ok(sent[0].headers["List-Unsubscribe"].includes("/api/unsubscribe?e="));
    assert.ok(!sent[0].html.includes("<b>Hello</b>")); // escaped
    await api(`/api/admin/campaigns/${id}/send`, { method: "POST", cookie });
    assert.equal(sent.length, 2); // nobody twice
    assert.equal((await db.get("SELECT status, sent_count FROM campaigns WHERE id = ?", id)).sent_count, 2);
    assert.equal((await api(`/api/admin/campaigns/${id}`, { method: "PUT", cookie, body: { subject: "Changed", content: { body: "x" } } })).status, 409);
  } finally {
    mail.send = realSend;
    mail.configured = realReady;
  }
});

test("data deletion requests are stored for the team; pages get their own title, and unknown ones a real 404", async () => {
  const cookie = await signIn();
  assert.equal((await api("/api/deletion-requests", { method: "POST", body: { email: "not-an-email" } })).status, 400);
  assert.equal((await api("/api/deletion-requests", { method: "POST", body: { email: "asha@example.com", name: "Asha", details: "Please delete my enquiry" } })).status, 201);
  const reqs = (await (await api("/api/admin/deletion-requests", { cookie })).json()).requests;
  assert.equal(reqs[0].email, "asha@example.com");
  assert.equal((await api(`/api/admin/deletion-requests/${reqs[0].id}`, { method: "PATCH", cookie, body: { status: "done" } })).status, 200);
  const about = await fetch(base + "/about");
  assert.equal(about.status, 200);
  assert.match(await about.text(), /<title>About Cube Software/);
  const missing = await fetch(base + "/no-such-page-here");
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /noindex/);
});

