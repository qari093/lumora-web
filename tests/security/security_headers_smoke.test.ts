import { describe, expect, test } from "vitest";

function __resolveTestBase(): string {
  const env = process.env.TEST_BASE_URL || process.env.BASE_URL;
  if (env && env !== "/") return env;
  return "http://127.0.0.1:3000";
}

const BASE = __resolveTestBase();

type HeadOut = { status: number; headers: Headers };


async function head(path: string, timeoutMs = 15000) {
  const url = String(new URL(path, BASE));
  const to = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout:" + timeoutMs + "ms")), timeoutMs));
  const res = (await Promise.race([fetch(url, { method: "HEAD", cache: "no-store" as any }), to])) as Response;
  return { status: res.status, headers: res.headers };
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
