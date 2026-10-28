// PostgreSQL: Supabase now, any Postgres later (only DATABASE_URL changes). The tables are defined in
// supabase/schema.sql, which runs on start-up. Every query uses bound parameters, so user input is never
// spliced into SQL. Queries are written with `?` placeholders, numbered ($1, $2 ...) here.
const fs = require("node:fs");
const path = require("node:path");
const config = require("./config");

// Read only when the schema is actually applied: on serverless the SQL file isn't shipped with the code,
// and the schema is applied there by running supabase/schema.sql yourself.
const schemaSql = () => fs.readFileSync(path.join(__dirname, "..", "supabase", "schema.sql"), "utf8");

const toPg = (sql) => {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
};
// Timestamps come back as ISO strings, whichever driver is underneath.
const clean = (row) => {
  for (const k in row) if (row[k] instanceof Date) row[k] = row[k].toISOString();
  return row;
};

// client: anything with query(text, params) -> { rows, rowCount | affectedRows } (pg Pool, or PGlite).
function wrap(client, close) {
  const query = async (sql, params) => {
    const r = await client.query(toPg(sql), params);
    return { rows: r.rows.map(clean), count: r.rowCount ?? r.affectedRows ?? 0 };
  };
  return {
    all: async (sql, ...p) => (await query(sql, p)).rows,
    get: async (sql, ...p) => (await query(sql, p)).rows[0],
    run: async (sql, ...p) => {
      const r = await query(sql, p);
      return { changes: r.count, row: r.rows[0] };
    },
    close,
  };
}

// Postgres "unique violation", e.g. a slot that was just booked or a blog slug already in use.
const isUnique = (e) => e?.code === "23505";

// An embedded Postgres (tests, or local development without Supabase).
async function embedded(dir) {
  const { PGlite } = require("@electric-sql/pglite");
  const lite = new PGlite(dir);
  await lite.exec(schemaSql());
  return wrap(lite, () => lite.close());
}

async function open(url = config.databaseUrl) {
  if (url === "memory:") return embedded();
  if (!url) {
    if (config.production) throw new Error("DATABASE_URL is not set. See server/.env.example.");
    console.warn("[db] DATABASE_URL not set: using a local test database in server/data/pglite.");
    return embedded(path.join(__dirname, "..", "data", "pglite"));
  }

  const pg = require("pg");
  pg.types.setTypeParser(20, Number); // bigint: counts and millisecond timestamps
  pg.types.setTypeParser(1184, (v) => new Date(v).toISOString()); // timestamptz
  const u = new URL(url);
  u.searchParams.delete("sslmode"); // TLS is set up below, not by the URL
  let ssl = false;
  if (!["localhost", "127.0.0.1", "::1"].includes(u.hostname)) {
    const ca = config.dbCaCert || (config.dbCaFile && fs.readFileSync(config.dbCaFile, "utf8"));
    if (ca) ssl = { ca, rejectUnauthorized: true };
    else if (config.production)
      throw new Error("Set DB_CA_CERT (the certificate's text) or DB_CA_FILE (a path to it) from Supabase: Project Settings > Database > SSL. Production connections must be verified.");
    else {
      console.warn("[db] No DB_CA_CERT/DB_CA_FILE: the connection is encrypted but the server's certificate isn't verified (fine for development only).");
      ssl = { rejectUnauthorized: false };
    }
  }
  // Serverless runs many short-lived instances at once, so each keeps a single connection to stay well
  // inside the pooler's limit; a long-running server keeps a small pool.
  const pool = new pg.Pool({ connectionString: u.toString(), ssl, max: config.serverless ? 1 : 10, idleTimeoutMillis: 30_000 });
  if (config.applySchema) await pool.query(schemaSql());
  return wrap(pool, () => pool.end());
}

module.exports = { open, isUnique };
