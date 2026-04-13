import { describe, expect, it } from "vitest";

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3001";

describe("progress http smoke", () => {
  it("responds 200 for /progress", async () => {
    const res = await fetch(`${BASE}/progress`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html.includes("Launch Progress")).toBe(true);
    expect(html.includes("data-progress-last-step")).toBe(true);
    expect(html.includes("data-progress-total-steps")).toBe(true);
    expect(html.includes("data-progress-phase")).toBe(true);
    expect(html.includes("data-progress-status")).toBe(true);
    expect(html.includes("data-progress-percent")).toBe(true);
  });
});
