import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("live healthz contract", () => {
  it("uses a safe production healthz response", () => {
    const src = fs.readFileSync("app/api/live/healthz/route.ts", "utf8");
    expect(src).toContain('service: "live"');
    expect(src).toContain('status: "healthy"');
    expect(src).toContain("no-store");
    expect(src).not.toContain("process.env.");
  });
});
