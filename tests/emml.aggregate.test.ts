// @ts-nocheck
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

describe("EMML Aggregate Engine — Contract Guard", () => {
  const root = process.cwd();
  const routePath = join(root, "app/api/emml/aggregate/route.ts");

  it("should have the aggregate route file", () => {
    expect(existsSync(routePath)).toBe(true);
  });

  it("should export POST handler", () => {
    const src = readFileSync(routePath, "utf8");
    expect(src.includes("export async function POST")).toBe(true);
  });

  it("should mention aggregate or weighting logic", () => {
    const src = readFileSync(routePath, "utf8").toLowerCase();
    const ok =
      src.includes("aggregate") ||
      src.includes("weight") ||
      src.includes("composite") ||
      src.includes("blend");

    expect(ok).toBe(true);
  });
});
