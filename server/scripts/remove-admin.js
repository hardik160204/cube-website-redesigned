// Removes an admin completely: their row in the admins table and their Supabase Auth user. The owner
// (master admin) is protected and can't be removed this way; make someone else the owner first with
// `npm run set-owner`. Run on the server only.
//   npm run remove-admin -- someone@cube-software.com
const { open } = require("../src/db");
const supabase = require("../src/supabase");
const { EMAIL } = require("../src/validate");

async function main() {
  const email = (process.argv[2] || "").trim();
  if (!EMAIL.test(email)) throw new Error("Usage: npm run remove-admin -- someone@cube-software.com");
  const db = await open();
  try {
    const row = await db.get("SELECT id, auth_user_id, is_owner FROM admins WHERE lower(email) = lower(?)", email);
    if (!row) {
      console.log(`No admin account for ${email}.`);
      return;
    }
    if (row.is_owner) throw new Error(`${email} is the owner (master admin) and can't be removed. Make someone else the owner first: npm run set-owner.`);
    await db.run("DELETE FROM admins WHERE id = ?", row.id); // also removes their sessions and sign-in codes
    await supabase.deleteUser(row.auth_user_id);
    await db.run("INSERT INTO audit_log (email, action, detail) VALUES (?, ?, ?)", email, "admin_removed", "remove-admin on the server");
    console.log(`Removed ${email} from the dashboard and from Supabase Auth.`);
  } finally {
    await db.close();
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
