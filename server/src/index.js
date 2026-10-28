const fs = require("node:fs");
const path = require("node:path");
const config = require("./config");
const { open } = require("./db");
const { createApp } = require("./app");
const retention = require("./retention");

async function main() {
  const db = await open();

  // First run: load the starter blog posts so the blog is never empty.
  if ((await db.get("SELECT COUNT(*)::int n FROM posts")).n === 0) {
    const posts = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "seed", "posts.json"), "utf8"));
    for (const [i, p] of posts.entries()) {
      await db.run("INSERT INTO posts (slug, title, category, icon, excerpt, body, sort) VALUES (?, ?, ?, ?, ?, ?::jsonb, ?)", p.slug, p.title, p.category, p.icon, p.excerpt, JSON.stringify(p.body), i);
    }
    console.log(`[seed] ${posts.length} blog posts`);
  }

  if ((await db.get("SELECT COUNT(*)::int n FROM admins")).n === 0) {
    console.warn("[setup] No admin account yet. Create one with: npm run create-admin -- you@cube-software.com");
  }
  if (!config.supabase.url || !config.supabase.anonKey || !config.supabase.secretKey) {
    console.warn("[setup] Supabase keys missing in server/.env: admin sign-in and image uploads won't work until they're set.");
  }
  if (!fs.existsSync(path.join(config.buildDir, "index.html"))) {
    console.warn(`[setup] No website build at ${config.buildDir}. Run "npm run build" in frontend/.`);
  }

  retention.start(db);
  const server = createApp(db).listen(config.port, () => console.log(`Cube Software site on http://localhost:${config.port}`));
  for (const sig of ["SIGINT", "SIGTERM"]) {
    process.on(sig, () => server.close(async () => {
      await db.close();
      process.exit(0);
    }));
  }
}

main().catch((e) => {
  console.error(`[start] ${e.message}`);
  process.exit(1);
});
