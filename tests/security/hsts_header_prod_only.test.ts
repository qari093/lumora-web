import { describe, expect, test } from "vitest";

function baseUrl(): string {
  const raw = (process.env.BASE_URL || "http://127.0.0.1:3000").trim();
  const cleaned = raw.replace(/\/+$/, "");
  if (cleaned === "" || cleaned === "http://" || cleaned === "https://") return "http://127.0.0.1:3000";
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  return `http://${cleaned}`;
}

async function head(path: string, timeoutMs = 20000) {
  const b = baseUrl();
  const url = new URL(path, b).toString();
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(new Error(`abort:${timeoutMs}ms`)), timeoutMs);
  try {
    const r = await fetch(url, { method: "HEAD", redirect: "manual", signal: ac.signal });
    return { r, get: (k: string) => r.headers.get(k) };
  } finally {
    clearTimeout(t);
  }
}

describe("security headers: HSTS (prod-only)", () => {
  test(
    "dev server should NOT set Strict-Transport-Security",
    async () => {
      const { r, get } = await head("/api/health", 20000);
      expect([200, 301, 302, 307, 308]).toContain(r.status);
      const h = get("strict-transport-security");
      expect(h).toBeNull();
    },
    30000
  );

  test(
    "prod-simulated should set Strict-Transport-Security (when enabled by env)",
    async () => {
      const { r, get } = await head("/api/health", 20000);
      expect([200, 301, 302, 307, 308]).toContain(r.status);
      const h = get("strict-transport-security");
      expect(typeof h).toBe("string");
      expect((h || "").toLowerCase()).toContain("max-age=");
    },
    30000
  );
});
