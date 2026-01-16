import { describe, expect, test } from "vitest";

type HeadOut = { status: number; headers: Headers };

const BASE = new URL(process.env.LUMORA_TEST_BASE || "http://127.0.0.1:3000");

async function head(path: string, timeoutMs = 25_000): Promise<HeadOut> {
  const url = new URL(path, BASE);
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(new Error("aborted")), timeoutMs);
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store", signal: ac.signal });
    return { status: res.status, headers: res.headers };
  } finally {
    clearTimeout(t);
  }
}

function getHeader(h: Headers, name: string): string {
  // Some runtimes may represent multiple values; Headers.get() returns string|null.
  return (h.get(name) || "").toString();
}

describe("security headers: smoke", () => {
  test(
    "health includes X-Content-Type-Options: nosniff",
    async () => {
      const r = await head("/api/health", 35_000);
      expect([200, 301, 302, 307, 308]).toContain(r.status);
      const v = getHeader(r.headers, "x-content-type-options");
      expect(v.toLowerCase()).toContain("nosniff");
    },
    120_000
  );

  test(
    "core portal routes exist (no 404) and include nosniff",
    async () => {
      const paths = ["/", "/gmar", "/movies", "/nexa", "/videos", "/video", "/live"];
      for (const p of paths) {
        const r = await head(p, 35_000);
        expect([200, 301, 302, 307, 308]).toContain(r.status);
        const v = getHeader(r.headers, "x-content-type-options");
        expect(v.toLowerCase()).toContain("nosniff");
      }
    },
    240_000
  );
});
