import { describe, expect, it } from "vitest";

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3001";

describe("status http smoke", () => {
  it("responds 200 for /status", async () => {
    const res = await fetch(`${BASE}/status`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html.includes("System Status")).toBe(true);
    expect(html.includes("data-status-readiness")).toBe(true);
    expect(html.includes("data-status-health")).toBe(true);
    expect(html.includes("data-status-total")).toBe(true);
    expect(html.includes("data-status-active")).toBe(true);
    expect(html.includes("data-status-healthy")).toBe(true);
    expect(html.includes("data-status-score")).toBe(true);
  });
});
