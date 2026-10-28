// Registers an email as the owner (master admin): permanent, can't be removed, and the only admin who can
// add or remove other admins. If the email has no admin account yet, it's created first. The previous
// owner stays on as a regular admin.
// Run on the server only; it can't be done from the dashboard, so a stolen admin login can't take over.
//   npm run set-owner -- master@cube-software.com
// The password is never typed in the command or shown on screen. If you don't set ADMIN_PASSWORD or type
// one at the prompt, a strong one is generated and written only to server/data/admin-login.txt.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const readline = require("node:readline");
const { open } = require("../src/db");
const supabase = require("../src/supabase");
const { strongPassword } = require("../src/security");
const { EMAIL } = require("../src/validate");

// Saved only here. This file is git-ignored and sits on the server; it is never served or sent anywhere.
const SECRET_FILE = path.join(__dirname, "..", "data", "admin-login.txt");

function generatePassword() {
  return `Cube-${crypto.randomBytes(15).toString("base64url")}-7`;
}

// Order: ADMIN_PASSWORD, then a prompt if someone is at the keyboard, else a generated one saved to the file.
async function obtainPassword(email) {
  if (process.env.ADMIN_PASSWORD) return { password: process.env.ADMIN_PASSWORD };
  if (process.stdin.isTTY) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const p = await new Promise((resolve) => rl.question("New account. Choose its password (12+ characters, letters and numbers), or leave blank to auto-generate: ", resolve));
    rl.close();
    if (p.trim()) return { password: p.trim() };
  }
  const password = generatePassword();
  fs.mkdirSync(path.dirname(SECRET_FILE), { recursive: true });
  fs.writeFileSync(
    SECRET_FILE,
    `Cube Software MASTER admin sign-in (keep this secret; delete after you change the password)\nURL: /admin\nemail: ${email}\npassword: ${password}\n`,
    { mode: 0o600 }
  );
  console.log(`A strong password was generated and saved to ${SECRET_FILE} (nowhere else).`);
  return { password };
}

async function main() {
  const email = (process.argv[2] || "").trim();
  if (!EMAIL.test(email)) throw new Error("Usage: npm run set-owner -- master@cube-software.com");
  const db = await open();
  try {
    let row = await db.get("SELECT id, is_owner FROM admins WHERE lower(email) = lower(?)", email);
    if (!row) {
      const { password } = await obtainPassword(email);
      if (!strongPassword(password)) throw new Error("Password needs 12+ characters with letters and numbers.");
      const authId = await supabase.upsertUser(email, password);
      row = (
        await db.run(
          "INSERT INTO admins (email, auth_user_id) VALUES (?, ?) ON CONFLICT (auth_user_id) DO UPDATE SET email = excluded.email RETURNING id, is_owner",
          email,
          authId
        )
      ).row;
      console.log(`Admin account created for ${email}.`);
    }
    if (row.is_owner) {
      console.log(`${email} is already the owner (master admin).`);
      return;
    }
    const before = await db.get("SELECT email FROM admins WHERE is_owner");
    await db.run("SELECT transfer_owner(?::int)", row.id);
    await db.run("INSERT INTO audit_log (admin_id, email, action, detail) VALUES (?, ?, ?, ?)", row.id, email, "owner_transferred", `from ${before?.email || "nobody"} (set-owner on the server)`);
    console.log(`${email} is now the owner (master admin). It can't be removed, and only it can add or remove admins.`);
    if (before) console.log(`${before.email} stays on as a regular admin.`);
  } finally {
    await db.close();
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
