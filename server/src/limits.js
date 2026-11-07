// Request limits against bots and floods (forms, sign-in, page counts). On Vercel many short-lived copies of the
// server run at once, so a limit counted inside one copy can be dodged by spreading requests out. With Redis
// configured (Upstash, over HTTPS: UPSTASH_REDIS_REST_URL and _TOKEN, or Vercel's KV_REST_API_URL and _TOKEN) every
// copy shares one count. Without it, each copy counts on its own as before. If Redis is unreachable, requests are
// let through rather than blocking every visitor (and the error is logged).
const rateLimit = require("express-rate-limit");
const config = require("./config");

async function redis(commands, { url, token }) {
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(1500),
  });
  if (!res.ok) throw new Error(`Redis answered ${res.status}`);
  return (await res.json()).map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

// The store interface express-rate-limit expects: one counter per key that expires with the window.
class RedisStore {
  constructor(name, conn = config.redis) {
    this.prefix = `rl:${name}:`;
    this.conn = conn;
    this.localKeys = false;
  }
  init(options) {
    this.windowMs = options.windowMs;
  }
  async increment(key) {
    const k = this.prefix + key;
    // SET ... NX PX starts the window only for the first hit; INCR keeps the expiry.
    const [, hits, ttl] = await redis([["SET", k, "0", "PX", String(this.windowMs), "NX"], ["INCR", k], ["PTTL", k]], this.conn);
    return { totalHits: Number(hits), resetTime: new Date(Date.now() + Math.max(Number(ttl), 0)) };
  }
  async decrement(key) {
    await redis([["DECR", this.prefix + key]], this.conn);
  }
  async resetKey(key) {
    await redis([["DEL", this.prefix + key]], this.conn);
  }
}

const limit = (name, options) =>
  rateLimit({
    standardHeaders: "draft-7",
    legacyHeaders: false,
    passOnStoreError: true,
    ...options,
    ...(config.redis.url ? { store: new RedisStore(name) } : {}),
  });

module.exports = { limit, RedisStore };
