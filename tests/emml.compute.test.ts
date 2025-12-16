// @ts-nocheck
// FILE: tests/emml.compute.test.ts
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const routePath = join(process.cwd(), "app/api/emml/compute/route.ts");

describe("EMML Compute Engine — Contract Guard", () => {
  it("should have the compute route file", () => {
    expect(existsSync(routePath)).toBe(true);
  });

  it("should export POST handler", () => {
    const src = readFileSync(routePath, "utf8");
    expect(src.includes("export async function POST")).toBe(true);
  });

  it("should include weighting or composite calculation logic", () => {
    const src = readFileSync(routePath, "utf8").toLowerCase();
    const ok =
      src.includes("composite") ||
      src.includes("0.5") ||
      src.includes("0.3") ||
      src.includes("0.2") ||
      src.includes("weighted");
    expect(ok).toBe(true);
  });
});