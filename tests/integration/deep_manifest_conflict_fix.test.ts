import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("deep manifest conflict fix", () => {
  it("keeps only app/manifest.ts as canonical manifest", () => {
    expect(fs.existsSync("app/manifest.ts")).toBe(true);
    expect(fs.existsSync("public/manifest.webmanifest")).toBe(false);
    expect(fs.existsSync("public/manifest.json")).toBe(false);
    expect(fs.existsSync("app/manifest.webmanifest")).toBe(false);
    expect(fs.existsSync("app/manifest.json")).toBe(false);
  });
});
