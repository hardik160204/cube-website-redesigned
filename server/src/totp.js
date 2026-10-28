// Time-based one-time codes (RFC 6238, the standard Google/Microsoft Authenticator use): the admin scans a
// QR once, then the app shows a new 6-digit code every 30 seconds. No email or SMTP is involved. Secrets are
// stored encrypted at rest. SHA-1, 6 digits, 30-second step, with a ±1 step window for clock drift.
const crypto = require("node:crypto");
const config = require("./config");

const DIGITS = 6;
const STEP = 30;
const ISSUER = "Cube Software";

// Base32 (RFC 4648, no padding) — the format authenticator apps expect for the secret.
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32Encode(buf) {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const b of buf) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}
function base32Decode(str) {
  let bits = 0;
  let value = 0;
  const out = [];
  for (const c of String(str).toUpperCase().replace(/[^A-Z2-7]/g, "")) {
    value = (value << 5) | B32.indexOf(c);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

function hotp(key, counter) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3];
  return String(code % 10 ** DIGITS).padStart(DIGITS, "0");
}

const generateSecret = () => base32Encode(crypto.randomBytes(20));

// The current code for a secret — what an authenticator app would show now. (Used by the test suite.)
const generate = (secretB32, now = Date.now()) => hotp(base32Decode(secretB32), Math.floor(now / 1000 / STEP));

function verify(secretB32, token, now = Date.now()) {
  if (typeof token !== "string" || !new RegExp(`^\\d{${DIGITS}}$`).test(token.trim())) return false;
  const key = base32Decode(secretB32);
  const counter = Math.floor(now / 1000 / STEP);
  const given = Buffer.from(token.trim());
  for (let w = -1; w <= 1; w++) {
    const expected = Buffer.from(hotp(key, counter + w));
    if (expected.length === given.length && crypto.timingSafeEqual(expected, given)) return true;
  }
  return false;
}

// The string an authenticator app reads from the QR code (or that you type in by hand as a setup key).
function otpauthURL(secretB32, email) {
  const params = new URLSearchParams({ secret: secretB32, issuer: ISSUER, algorithm: "SHA1", digits: String(DIGITS), period: String(STEP) });
  return `otpauth://totp/${encodeURIComponent(`${ISSUER}:${email}`)}?${params.toString()}`;
}

// Encrypt the secret before it is stored, with a key derived from APP_SECRET (so a database dump alone can't
// use the secrets). AES-256-GCM.
const encKey = crypto.createHash("sha256").update(`cube-totp:${config.appSecret}`).digest();
function encryptSecret(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encKey, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return `v1:${iv.toString("base64")}:${cipher.getAuthTag().toString("base64")}:${enc.toString("base64")}`;
}
function decryptSecret(stored) {
  const [v, ivB, tagB, dataB] = String(stored).split(":");
  if (v !== "v1") return null;
  try {
    const decipher = crypto.createDecipheriv("aes-256-gcm", encKey, Buffer.from(ivB, "base64"));
    decipher.setAuthTag(Buffer.from(tagB, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(dataB, "base64")), decipher.final()]).toString("utf8");
  } catch {
    return null; // wrong APP_SECRET, or tampered data
  }
}

module.exports = { generateSecret, generate, verify, otpauthURL, encryptSecret, decryptSecret, base32Encode, DIGITS };
