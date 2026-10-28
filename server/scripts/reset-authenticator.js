// Clears an admin's authenticator app, so they set up a new one on their next sign-in. Use this if the owner
// (or anyone) loses their phone and is locked out. Run on the server.
//   npm run reset-authenticator -- info@cube-software.com
const { open } = require("../src/db");
const { EMAIL } = require("../src/validate");

async function main() {
  const email = (process.argv[2] || "").trim();
  if (!EMAIL.test(email)) throw new Error("Usage: npm run reset-authenticator -- someone@cube-software.com");
  const db = await open();
  try {
    const info = await db.run("UPDATE admins SET totp_secret = NULL WHERE lower(email) = lower(?)", email);
    if (!info.changes) {
      console.log(`No admin account for ${email}.`);
      return;
    }
    await db.run("DELETE FROM sessions WHERE admin_id = (SELECT id FROM admins WHERE lower(email) = lower(?))", email);
    await db.run("INSERT INTO audit_log (email, action, detail) VALUES (?, ?, ?)", email, "authenticator_reset", "reset-authenticator on the server");
    console.log(`Authenticator cleared for ${email}. They'll set up a new one (scan a new QR) at the next sign-in.`);
  } finally {
    await db.close();
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
