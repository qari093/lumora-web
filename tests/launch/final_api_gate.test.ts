import { describe, expect, it } from "vitest";

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3001";

describe("final api gate", () => {
  const routes = [
    ["/api/portals", "ok"],
    ["/api/portal-status", "ok"],
    ["/api/portal-health", "ok"],
    ["/api/portal-cards", "ok"],
    ["/api/portal-overview", "ok"],
    ["/api/launch/readiness", "ok"],
    ["/api/health", "ok"],
    ["/api/fyp/summary", "ok"],
    ["/api/gmar/summary", "ok"],
    ["/api/nexa/summary", "ok"],
    ["/api/cineverse/summary", "ok"],
    ["/api/live/summary", "ok"],
    ["/api/wallet/summary", "ok"],
    ["/api/profile/summary", "ok"],
  ] as const;

  for (const [route, okKey] of routes) {
    it(`responds 200 for ${route}`, async () => {
      const res = await fetch(`${BASE}${route}`);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json[okKey]).toBe(true);
    });
  }
});
