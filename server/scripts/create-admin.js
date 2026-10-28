// Creates an admin (a Supabase Auth user plus an entry in the admins table), or resets their password.
// There are no default passwords.
//   npm run create-admin -- you@cube-software.com
// The password is read from the ADMIN_PASSWORD variable, or typed at the prompt.
const readline = require("node:readline");
const { open } = require("../src/db");
const supabase = require("../src/supabase");
const { strongPassword } = require("../src/security");
const { EMAIL } = require("../src/validate");

async function main() {
  const email = (process.argv[2] || "").trim();
  if (!EMAIL.test(email)) throw new Error("Usage: npm run create-admin -- you@cube-software.com");
  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    password = await new Promise((resolve) => rl.question("Password (12+ characters, letters and numbers): ", resolve));
    rl.close();
  }
  if (!strongPassword(password)) throw new Error("Password needs 12+ characters with letters and numbers.");
  const authId = await supabase.upsertUser(email, password);
  const db = await open();
  await db.run(
    // The very first admin becomes the owner.
    `INSERT INTO admins (email, auth_user_id, is_owner) VALUES (?, ?, NOT EXISTS (SELECT 1 FROM admins WHERE is_owner))
     ON CONFLICT (auth_user_id) DO UPDATE SET email = excluded.email, failed_attempts = 0, locked_until = 0`,
    email, authId
  );
  await db.run("DELETE FROM sessions WHERE admin_id = (SELECT id FROM admins WHERE auth_user_id = ?)", authId);
  await db.close();
  console.log(`Admin ready: ${email}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
