import { describe, expect, it } from "vitest";

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3001";

describe("mission-control http smoke", () => {
  it("responds 200 for /mission-control", async () => {
    const res = await fetch(`${BASE}/mission-control`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html.includes("Mission Control")).toBe(true);
    expect(html.includes("data-mission-card")).toBe(true);
    expect(html.includes("data-mission-portal")).toBe(true);
    expect(html.includes("Portal Command Grid")).toBe(true);
    expect(html.includes("Launch Status")).toBe(true);
    expect(html.includes("Readiness Score")).toBe(true);
    expect(html.includes("Active Portals")).toBe(true);
    expect(html.includes("Healthy Portals")).toBe(true);
  });
});
