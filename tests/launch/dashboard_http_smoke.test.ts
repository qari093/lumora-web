import { describe, expect, it } from "vitest";

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3001";

describe("dashboard http smoke", () => {
  it("responds 200 for /dashboard", async () => {
    const res = await fetch(`${BASE}/dashboard`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html.includes("Launch Dashboard")).toBe(true);
    expect(html.includes("data-dashboard-card")).toBe(true);
    expect(html.includes("data-dashboard-portal")).toBe(true);
    expect(html.includes("Readiness")).toBe(true);
    expect(html.includes("Score")).toBe(true);
    expect(html.includes("Active Portals")).toBe(true);
    expect(html.includes("Healthy Portals")).toBe(true);
  });
});
