// Authenticator codes (TOTP). Checks the official RFC 6238 vector and that the QR uses the parameters
// Google Authenticator expects (SHA1, 6 digits, 30s), plus the encrypt/verify round trip.
const test = require("node:test");
const assert = require("node:assert/strict");
const totp = require("../src/totp");

test("matches the RFC 6238 test vector (so Google Authenticator agrees)", () => {
  const secret = totp.base32Encode(Buffer.from("12345678901234567890", "ascii"));
  assert.equal(totp.generate(secret, 59_000), "287082");
  assert.ok(totp.verify(secret, "287082", 59_000));
  assert.ok(!totp.verify(secret, "000000", 59_000));
});

test("accepts the previous and next 30-second window (clock drift)", () => {
  const secret = totp.generateSecret();
  const now = Date.now();
  assert.ok(totp.verify(secret, totp.generate(secret, now - 30_000), now));
  assert.ok(totp.verify(secret, totp.generate(secret, now), now));
  assert.ok(totp.verify(secret, totp.generate(secret, now + 30_000), now));
  assert.ok(!totp.verify(secret, totp.generate(secret, now + 120_000), now)); // too far ahead
});

test("otpauth URL carries Google-Authenticator-compatible parameters", () => {
  const url = new URL(totp.otpauthURL("ABCDEF", "info@cube-software.com"));
  assert.equal(url.protocol, "otpauth:");
  assert.equal(url.host, "totp");
  assert.equal(url.searchParams.get("algorithm"), "SHA1");
  assert.equal(url.searchParams.get("digits"), "6");
  assert.equal(url.searchParams.get("period"), "30");
  assert.equal(url.searchParams.get("secret"), "ABCDEF");
  assert.equal(url.searchParams.get("issuer"), "Cube Software");
});

test("secrets encrypt and decrypt; tampering is rejected", () => {
  const s = totp.generateSecret();
  const enc = totp.encryptSecret(s);
  assert.ok(enc.startsWith("v1:") && !enc.includes(s));
  assert.equal(totp.decryptSecret(enc), s);
  // Corrupt the auth tag (3rd field) — GCM must reject it.
  const parts = enc.split(":");
  parts[2] = (parts[2][0] === "A" ? "B" : "A") + parts[2].slice(1);
  assert.equal(totp.decryptSecret(parts.join(":")), null);
});

test("malformed codes are rejected without throwing", () => {
  const s = totp.generateSecret();
  for (const bad of ["", "12345", "1234567", "abcdef", "' OR 1=1", null, undefined, 123456]) assert.equal(totp.verify(s, bad), false);
});
