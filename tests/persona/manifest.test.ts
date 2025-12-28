import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("persona manifest", () => {
  it("exists and has expected counts shape", () => {
    const p = path.join(process.cwd(), "public", "persona", "manifest.json");
    expect(fs.existsSync(p)).toBe(true);

    const json = JSON.parse(fs.readFileSync(p, "utf8"));
    expect(json.ok).toBe(true);
    expect(json.counts).toBeTruthy();
    expect(typeof json.counts.total).toBe("number");
    expect(typeof json.counts.emojis).toBe("number");
    // Guardrails: at least the seeded targets should exist (placeholders)
    expect(json.counts.emojis).toBeGreaterThanOrEqual(480);
    expect(json.counts.avatarsNeutral).toBeGreaterThanOrEqual(120);
  });
});
