// The shared (Redis) request limit, against a pretend Upstash that speaks the same REST pipeline.
const test = require("node:test");
const assert = require("node:assert/strict");
const { RedisStore } = require("../src/limits");

test("Redis limit store: counts per key across calls, starts the window once, and resets", async () => {
  const data = new Map(); // key -> { n, expires }
  const realFetch = global.fetch;
  global.fetch = async (url, init) => {
    assert.equal(url, "https://redis.example/pipeline");
    assert.equal(init.headers.Authorization, "Bearer secret");
    const out = JSON.parse(init.body).map(([cmd, k, ...rest]) => {
      const now = Date.now();
      const e = data.get(k);
      if (cmd === "SET") {
        if (e && e.expires > now) return { result: null };
        data.set(k, { n: 0, expires: now + Number(rest[2]) });
        return { result: "OK" };
      }
      if (cmd === "INCR") return { result: ++data.get(k).n };
      if (cmd === "DECR") return { result: --data.get(k).n };
      if (cmd === "PTTL") return { result: data.get(k).expires - now };
      if (cmd === "DEL") return { result: Number(data.delete(k)) };
      return { error: "unknown command" };
    });
    return { ok: true, json: async () => out };
  };
  try {
    const a = new RedisStore("form", { url: "https://redis.example", token: "secret" });
    const b = new RedisStore("form", { url: "https://redis.example", token: "secret" }); // another server copy
    a.init({ windowMs: 60_000 });
    b.init({ windowMs: 60_000 });
    assert.equal((await a.increment("1.2.3.4")).totalHits, 1);
    const second = await b.increment("1.2.3.4");
    assert.equal(second.totalHits, 2); // shared between copies
    assert.ok(second.resetTime.getTime() - Date.now() <= 60_000);
    assert.equal((await a.increment("5.6.7.8")).totalHits, 1);
    await a.decrement("1.2.3.4");
    assert.equal((await a.increment("1.2.3.4")).totalHits, 2);
    await a.resetKey("1.2.3.4");
    assert.equal((await b.increment("1.2.3.4")).totalHits, 1);
  } finally {
    global.fetch = realFetch;
  }
});
