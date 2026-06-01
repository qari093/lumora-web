import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("persona assets serverless size safety", () => {
  it("does not reference large native FYP movie clips", () => {
    const route = fs.readFileSync("app/api/persona/assets/route.ts", "utf8");
    expect(route).not.toMatch(/native-fyp|movie-clips|readdir|readFile|public\/native/i);
  });

  it("uses lightweight manifest assets only", () => {
    const route = fs.readFileSync("app/api/persona/assets/route.ts", "utf8");
    expect(route).toMatch(/PERSONA_ASSETS/);
    expect(route).toMatch(/persona\/placeholders/);
  });
});
