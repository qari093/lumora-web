import fs from "node:fs";
import { describe, expect, it } from "vitest";

const read = (file: string) => fs.readFileSync(file, "utf8");

describe("Mega Step 24 active root App Router ownership", () => {
  it("materializes the quarantined pulse earn route into root app", () => {
    const file = "app/api/pulse/earn/route.ts";
    expect(fs.existsSync(file)).toBe(true);
    expect(read(file)).toMatch(/410/);
  });

  it("materializes the quarantined pulse spend route into root app", () => {
    const file = "app/api/pulse/spend/route.ts";
    expect(fs.existsSync(file)).toBe(true);
    expect(read(file)).toMatch(/410/);
  });

  it("materializes privacy export into root app with canonical session guard", () => {
    const file = "app/api/privacy/export/route.ts";
    expect(fs.existsSync(file)).toBe(true);
    const src = read(file);
    expect(src).toContain("requireUserSession");
    expect(src).toContain("userPrivateNoStoreHeaders");
  });

  it("materializes privacy consent into root app with canonical session guard", () => {
    const file = "app/api/privacy/consent/route.ts";
    expect(fs.existsSync(file)).toBe(true);
    const src = read(file);
    expect(src).toContain("requireUserSession");
    expect(src).toContain("userPrivateNoStoreHeaders");
  });
});
