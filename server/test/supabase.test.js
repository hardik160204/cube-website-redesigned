// The Supabase calls against a fake Supabase server: right paths, keys in the right headers, and the
// "user already exists" path for creating admins.
const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const config = require("../src/config");
const supabase = require("../src/supabase");

const seen = [];
const fake = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    seen.push({ method: req.method, url: req.url, apikey: req.headers.apikey, auth: req.headers.authorization, type: req.headers["content-type"], body });
    const send = (status, data) => res.writeHead(status, { "Content-Type": "application/json" }).end(JSON.stringify(data));
    if (req.url === "/auth/v1/token?grant_type=password") {
      const { password } = JSON.parse(body);
      return password === "right-pass-123" ? send(200, { user: { id: "u-1" } }) : send(400, { error: "invalid_grant" });
    }
    if (req.method === "POST" && req.url === "/auth/v1/admin/users") return send(422, { msg: "A user with this email address has already been registered" });
    if (req.method === "GET" && req.url.startsWith("/auth/v1/admin/users")) return send(200, { users: [{ id: "u-1", email: "Admin@Cube-Software.com" }] });
    if (req.method === "PUT" && req.url === "/auth/v1/admin/users/u-1") return send(200, { id: "u-1" });
    if (req.url.startsWith("/storage/v1/object/media/")) return send(200, { Key: "media/x" });
    send(404, { error: "not found" });
  });
});

test.before(async () => {
  await new Promise((r) => fake.listen(0, r));
  config.supabase.url = `http://127.0.0.1:${fake.address().port}`;
  config.supabase.anonKey = "sb_publishable_test";
  config.supabase.secretKey = "sb_secret_test";
});
test.after(() => fake.close());

test("sign-in uses the public key and reports wrong passwords as null", async () => {
  assert.equal(await supabase.signIn("admin@cube-software.com", "right-pass-123"), "u-1");
  assert.equal(await supabase.signIn("admin@cube-software.com", "wrong"), null);
  const call = seen.find((s) => s.url.startsWith("/auth/v1/token"));
  assert.equal(call.apikey, "sb_publishable_test");
  assert.equal(call.auth, undefined); // new-style keys go in apikey only
});

test("creating an existing user falls back to finding them and setting the password", async () => {
  seen.length = 0;
  assert.equal(await supabase.upsertUser("admin@cube-software.com", "new-pass-12345"), "u-1");
  assert.deepEqual(seen.map((s) => s.method), ["POST", "GET", "PUT"]);
  assert.ok(seen.every((s) => s.apikey === "sb_secret_test"));
  assert.equal(JSON.parse(seen[2].body).password, "new-pass-12345");
});

test("uploads send the bytes with their image type; legacy keys also go as a Bearer token", async () => {
  config.supabase.secretKey = "eyJlegacy.service.role";
  seen.length = 0;
  await supabase.upload("abc.png", Buffer.from("PNGDATA"), "image/png");
  assert.equal(seen[0].url, "/storage/v1/object/media/abc.png");
  assert.equal(seen[0].type, "image/png");
  assert.equal(seen[0].body, "PNGDATA");
  assert.equal(seen[0].auth, "Bearer eyJlegacy.service.role");
  assert.equal(supabase.publicUrl("abc.png"), `${config.supabase.url}/storage/v1/object/public/media/abc.png`);
});

test("deletes send no content type (Storage refuses a JSON type with an empty body)", async () => {
  seen.length = 0;
  await supabase.remove("abc.png");
  assert.equal(seen[0].method, "DELETE");
  assert.equal(seen[0].type, undefined);
});
