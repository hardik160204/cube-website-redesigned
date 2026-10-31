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
  assert.ok(!("ip" in rows[0]));
  const stats = await (await api("/api/admin/analytics?days=30", { cookie: await signIn() })).json();
  assert.ok(stats.pages.some((p) => p.label === "/pricing"));
});

test("team and social links: validated, stripped to known fields, served to the site", async () => {
  const cookie = await signIn();
  assert.deepEqual(await (await api("/api/site")).json(), { team: null, socials: null });
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

test("security headers are set", async () => {
  const res = await api("/api/demo-info");
  assert.match(res.headers.get("content-security-policy"), /frame-ancestors 'none'/);
  assert.equal(res.headers.get("x-powered-by"), null);
  assert.equal((await api("/api/nope")).status, 404);
});
