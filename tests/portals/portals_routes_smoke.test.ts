import { describe, it, expect, beforeAll } from "vitest";

type FetchOut = { status: number; ct: string; head: string };

function __resolveBase(): string {
  const v =
    process.env.TEST_BASE_URL ||
    process.env.LUMORA_BASE_URL ||
    process.env.BASE_URL ||
    "http://127.0.0.1:3000";
  try {
    // ensure absolute
    const u = new URL(v);
    return u.toString().replace(/\/+$/, "");
  } catch {
    return "http://127.0.0.1:3000";
  }
}

const BASE = __resolveBase();

function __sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function __withTimeout<T>(p: Promise<T>, ms: number, label = "timeout"): Promise<T> {
  let t: ReturnType<typeof setTimeout> | null = null;
  const to = new Promise<T>((_, rej) => {
    t = setTimeout(() => rej(new Error(label + ":" + ms + "ms")), ms);
  });
  return Promise.race([
    p.finally(() => {
      if (t) clearTimeout(t);
    }),
    to,
  ]);
}

async function __warmup(url: string, ms: number): Promise<void> {
  const started = Date.now();
  let last = "init";
  while (Date.now() - started < ms) {
    try {
      const r = await __withTimeout(fetch(url, { redirect: "manual" }), 15000, "warmup_fetch");
      if (typeof r.status === "number" && r.status > 0) return;
      last = "no_status";
    } catch (e: any) {
      last = e?.message ? String(e.message) : "warmup_failed";
    }
    await __sleep(250);
  }
  throw new Error("warmup_timeout:" + ms + "ms:last=" + last);
}

async function fetchHead(url: string, timeoutMs = 25000): Promise<FetchOut> {
  // Prefer HEAD; fallback to GET if HEAD is unsupported.
  let r: Response | null = null;
  try {
    r = await __withTimeout(fetch(url, { method: "HEAD", redirect: "manual" }), 20000, "head");
  } catch {
    r = null;
  }
  if (!r) {
    r = await __withTimeout(fetch(url, { redirect: "manual" }), 20000, "get");
  }

  const ct = (r.headers.get("content-type") || "").toLowerCase();
  let head = "";
  try {
    head = await __withTimeout(r.text(), Math.min(timeoutMs, 20000), "body");
  } catch {
    head = "";
  }
  return { status: r.status, ct, head: head.slice(0, 220) };
}

async function __pool<T>(limit: number, items: T[], fn: (item: T) => Promise<void>): Promise<void> {
  const q = items.slice();
  const n = Math.max(1, limit);
  const workers = Array.from({ length: n }, async () => {
    while (q.length) {
      const it = q.shift() as T;
      await fn(it);
    }
  });
  await Promise.all(workers);
}

// Keep this list aligned with Lumora “all portals active” requirement.
// Allow redirects (auth, canonicalization) but disallow 404/500.
const PATHS: Array<{ path: string; name: string }> = [
  { path: "/", name: "home" },
  { path: "/fyp", name: "FYP" },
  { path: "/gmar", name: "GMAR" },
  { path: "/videos", name: "Videos" },
  { path: "/nexa", name: "NEXA" },
  { path: "/movies", name: "Movies" },
  { path: "/live", name: "Live" },
  { path: "/share", name: "Share" },
  { path: "/celebrations", name: "Celebrations" },
];

describe("portals: route smoke", () => {
  // LUMORA_PORTALS_WARMUP_V2
  beforeAll(async () => {
    await __warmup(BASE + "/api/health", 60000);
    await __warmup(BASE + "/", 60000);
    // Prewarm each route once to avoid first-hit compile stalls.
    for (const p of PATHS) {
      await __warmup(BASE + p.path, 45000);
    }
  }, 180000);

  it(
    "all portal routes respond (200 or redirect)",
    async () => {
      const bad: Array<{ name: string; path: string; status: number; head: string }> = [];

      // bounded concurrency to reduce overload + keep deterministic timing
      await __pool(3, PATHS, async (p) => {
        const u = BASE + p.path;
        const out = await fetchHead(u, 25000);

        const ok =
          out.status === 200 ||
          out.status === 301 ||
          out.status === 302 ||
          out.status === 307 ||
          out.status === 308;

        if (!ok) {
          bad.push({ name: p.name, path: p.path, status: out.status, head: out.head });
          return;
        }

        if (out.status === 200) {
          const htmlish =
            out.ct.includes("text/html") ||
            out.head.includes("<!DOCTYPE html") ||
            out.head.includes("<html");

          const jsonish =
            out.ct.includes("application/json") ||
            out.head.trim().startsWith("{");

          if (!(htmlish || jsonish)) {
            bad.push({
              name: p.name,
              path: p.path,
              status: 599,
              head: "unexpected_content_type:" + out.ct + " head:" + out.head,
            });
          }
        }
      });

      if (bad.length) {
        throw new Error(
          "Portal smoke failures:\n" +
            bad
              .map(
                (b) =>
                  "- " +
                  b.name +
                  " " +
                  b.path +
                  ": " +
                  b.status +
                  "\n  head: " +
                  b.head.replace(/\s+/g, " ").slice(0, 180)
              )
              .join("\n")
        );
      }

      expect(bad.length).toBe(0);
    },
    180000
  );
});
