// @ts-nocheck
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const routePath = join(root, "app/api/emml/chart/route.ts");

describe("EMML Chart Route — Contract Guard", () => {
  it("should have the EMML chart route file", () => {
    expect(existsSync(routePath)).toBe(true);
  });

  it("should export GET handler", () => {
    const src = readFileSync(routePath, "utf8");
    expect(src.includes("export async function GET")).toBe(true);
  });

  it("should mention series/meta/range in the response body shape", () => {
    const src = readFileSync(routePath, "utf8").toLowerCase();

    const hasSeries = src.includes("series");
    const hasMeta = src.includes("meta");
    const hasRange = src.includes("range");

    expect(hasSeries).toBe(true);
    expect(hasMeta).toBe(true);
    expect(hasRange).toBe(true);
  });
});
