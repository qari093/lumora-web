import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Lumora invite image asset", () => {
  it("exists and is non-empty", () => {
    const path = "public/lumora-invite.png";
    expect(fs.existsSync(path)).toBe(true);
    const stat = fs.statSync(path);
    expect(stat.size).toBeGreaterThan(1000);
  });
});
