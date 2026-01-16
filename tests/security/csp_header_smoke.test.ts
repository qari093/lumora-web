import { describe, expect, test } from "vitest";

const BASE = new URL(process.env.LUMORA_TEST_BASE || "http://127.0.0.1:3000");

// Portal sweeps can be slow on first compile; keep this scoped to security suite only.
const PORTAL_HEAD_TIMEOUT_MS = 25_000;

async function head(path: string, timeoutMs = PORTAL_HEAD_TIMEOUT_MS): Promise<{ status: number; headers: Headers }> {
  const url = new URL(path, BASE);
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(new Error("aborted")), timeoutMs);
  const started = Date.now();
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store", signal: ac.signal });
    return { status: res.status, headers: res.headers };
  } catch (e: any) {
    const ms = Date.now() - started;
    const msg = typeof e?.message === "string" ? e.message : "fetch_failed";
    throw new Error(`HEAD failed: ${path} (${ms}ms) — ${msg}`);
  } finally {
    clearTimeout(t);
  }
}

function getHeader(h: Headers, name: string): string {
  return (h.get(name) || "").toString();
}

describe("security headers: CSP smoke", () => {
  test(
    "sets Content-Security-Policy on root and core portals (pinpoint slow route)",
    async () => {
      const paths = ["/", "/gmar", "/movies", "/nexa", "/videos", "/video", "/live"];
      for (const p of paths) {
        const r = await head(p);
        expect([200, 301, 302, 307, 308]).toContain(r.status);
        const csp = getHeader(r.headers, "content-security-policy");
        expect(csp.length).toBeGreaterThan(0);
      }
    },
    240_000
  );

  test(
    "sets Content-Security-Policy on /api/health",
    async () => {
      const r = await head("/api/health", 35_000);
      expect([200, 301, 302, 307, 308]).toContain(r.status);
      const csp = getHeader(r.headers, "content-security-policy");
      expect(csp.length).toBeGreaterThan(0);
    },
    120_000
  );
});
