import { describe, expect, test } from "vitest";

function baseUrl(): string {
  const def = "http://127.0.0.1:3000";
  const raw = (process.env.BASE_URL ?? "").trim();

  const clean = (u: string) => u.replace(/\/+$/, "");
  const isHttp = (u: URL) => u.protocol === "http:" || u.protocol === "https:";

  if (raw) {
    try {
      const u = new URL(raw);
      if (isHttp(u)) return clean(u.toString());
    } catch {}
  }
  if (raw && !/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL("http://" + raw);
      if (isHttp(u)) return clean(u.toString());
    } catch {}
  }
  return clean(def);
}

async function head(path: string, timeoutMs = 25000) {
  const b = baseUrl();
  const url = new URL(path, b).toString();

  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);

  const started = Date.now();
  try {
    const r = await fetch(url, { method: "HEAD", redirect: "manual", signal: ac.signal });
    const csp = r.headers.get("content-security-policy") || "";
    return { path, url, r, csp, ms: Date.now() - started };
  } catch (e: any) {
    const ms = Date.now() - started;
    const msg = typeof e?.message === "string" ? e.message : "fetch_failed";
    throw new Error(`HEAD failed: ${path} (${ms}ms) — ${msg}`);
  } finally {
    clearTimeout(t);
  }
}

function hasCsp(v: string): boolean {
  const s = (v || "").trim().toLowerCase();
  return s.includes("default-src") && s.length > 12;
}

describe("security headers: CSP smoke", () => {
  test(
    "sets Content-Security-Policy on root and core portals (pinpoint slow route)",
    async () => {
      const paths = ["/", "/gmar", "/movies", "/nexa", "/videos", "/video", "/live"];

      // Sequential on purpose: easier to pinpoint which route is slow/hanging in CI logs.
      for (const p of paths) {
        const o = await head(p, 25000);
        // eslint-disable-next-line no-console
        console.log(`[csp] ${p} status=${o.r.status} ms=${o.ms}`);
        expect([200, 301, 302, 307, 308]).toContain(o.r.status);
        expect(hasCsp(o.csp)).toBe(true);
      }
    },
    120000
  );

  test(
    "sets Content-Security-Policy on /api/health",
    async () => {
      const o = await head("/api/health", 25000);
      // eslint-disable-next-line no-console
      console.log(`[csp] /api/health status=${o.r.status} ms=${o.ms}`);
      expect([200, 204]).toContain(o.r.status);
      expect(hasCsp(o.csp)).toBe(true);
    },
    60000
  );
});
