import { describe, expect, test } from "vitest";

function normalizeHeaderValue(v: string | null): string {
  if (!v) return "";
  return String(v).trim();
}

function baseUrl() {
  const port = process.env.PORT || "3000";
  return `http://127.0.0.1:${port}`;
}

async function get(path: string, headers: Record<string, string>) {
  const url = `${baseUrl()}${path}`;
  return fetch(url, { method: "GET", redirect: "follow", headers });
}

describe("security headers: HSTS (prod-only)", () => {
  test(
    "dev should not set Strict-Transport-Security",
    async () => {
      const r = await get("/", { "user-agent": "vitest-hsts-dev" });
      expect([200, 301, 302, 307, 308, 404]).toContain(r.status);

      // Prove middleware executed (matcher must include "/")
      expect(r.headers.get("x-lumora-middleware")).toBe("1");

      const hv = normalizeHeaderValue(r.headers.get("strict-transport-security"));
      expect(hv.length).toBe(0);
    },
    90_000
  );

  test(
    "prod-sim should set Strict-Transport-Security when enabled by header contract",
    async () => {
      const r = await get("/", {
        "user-agent": "vitest-hsts-prodsim",
        "x-lumora-prod-sim": "1",
        "x-lumora-enable-hsts": "1",
      });
      expect([200, 301, 302, 307, 308, 404]).toContain(r.status);

      // Prove middleware executed (matcher must include "/")
      expect(r.headers.get("x-lumora-middleware")).toBe("1");

      const hv = normalizeHeaderValue(r.headers.get("strict-transport-security"));
      expect(hv.length).toBeGreaterThan(0);
      expect(hv.toLowerCase()).toContain("max-age=");
    },
    120_000
  );
});
