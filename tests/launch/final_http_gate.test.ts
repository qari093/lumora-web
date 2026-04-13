import { describe, expect, it } from "vitest";

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3001";

describe("final http gate", () => {
  const routes = [
    ["/", "Portal Hub"],
    ["/fyp", "For You"],
    ["/gmar", "GMAR"],
    ["/nexa", "NEXA"],
    ["/cineverse", "CineVerse"],
    ["/live", "Live"],
    ["/wallet", "Wallet"],
    ["/profile", "Profile"],
    ["/portals", "All Active Portals"],
    ["/launch", "Launch Snapshot"],
    ["/status", "System Status"],
    ["/progress", "Launch Progress"],
    ["/system", "System Index"],
    ["/dashboard", "Launch Dashboard"],
    ["/control-center", "Control Center"],
    ["/operator", "Operator Console"],
    ["/mission-control", "Mission Control"],
  ] as const;

  for (const [route, marker] of routes) {
    it(`responds 200 for ${route}`, async () => {
      const res = await fetch(`${BASE}${route}`);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html.includes(marker)).toBe(true);
    });
  }
});
