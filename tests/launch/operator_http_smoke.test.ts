import { describe, expect, it } from "vitest";

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3001";

describe("operator http smoke", () => {
  it("responds 200 for /operator", async () => {
    const res = await fetch(`${BASE}/operator`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html.includes("Operator Console")).toBe(true);
    expect(html.includes("data-operator-card")).toBe(true);
    expect(html.includes("data-operator-portal")).toBe(true);
    expect(html.includes("Portal Verification")).toBe(true);
    expect(html.includes("Readiness")).toBe(true);
    expect(html.includes("Score")).toBe(true);
    expect(html.includes("Active Portals")).toBe(true);
    expect(html.includes("Healthy Portals")).toBe(true);
  });
});
