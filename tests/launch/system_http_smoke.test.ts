import { describe, expect, it } from "vitest";

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3001";

describe("system http smoke", () => {
  it("responds 200 for /system", async () => {
    const res = await fetch(`${BASE}/system`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html.includes("System Index")).toBe(true);
    expect(html.includes("data-system-index-key")).toBe(true);
    expect(html.includes("Launch Snapshot")).toBe(true);
    expect(html.includes("System Status")).toBe(true);
    expect(html.includes("Launch Progress")).toBe(true);
    expect(html.includes("Portal Registry")).toBe(true);
  });
});
