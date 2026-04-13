import { describe, expect, it } from "vitest";

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3001";

describe("system routes smoke suite", () => {
  const routes = [
    ["/launch", "Launch Snapshot"],
    ["/status", "System Status"],
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
