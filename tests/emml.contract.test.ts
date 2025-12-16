// @ts-nocheck
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const ROUTES = [
  "app/api/emml/indices/route.ts",
  "app/api/emml/heat/route.ts",
  "app/api/emml/assets/route.ts",
  "app/api/emml/ticks/route.ts",
];

describe("EMML API — Contract Guard", () => {
  it("should have all core EMML route files present", () => {
    for (const rel of ROUTES) {
      const full = join(root, rel);
      expect(existsSync(full)).toBe(true);
    }
  });

  it("should export GET handlers from each EMML route", () => {
    for (const rel of ROUTES) {
      const full = join(root, rel);
      expect(existsSync(full)).toBe(true);

      const src = readFileSync(full, "utf8");
      expect(src.includes("export async function GET")).toBe(true);
    }
  });

  it("indices route should mention indices or markets in body", () => {
    const full = join(root, "app/api/emml/indices/route.ts");
    expect(existsSync(full)).toBe(true);
    const src = readFileSync(full, "utf8");

    const hasIndicesWord =
      src.toLowerCase().includes("indices") ||
      src.toLowerCase().includes("index");

    expect(hasIndicesWord).toBe(true);
  });

  it("heat route should mention heat or heatmap in body", () => {
    const full = join(root, "app/api/emml/heat/route.ts");
    expect(existsSync(full)).toBe(true);
    const src = readFileSync(full, "utf8");

    const hasHeatWord =
      src.toLowerCase().includes("heat") ||
      src.toLowerCase().includes("heatmap");

    expect(hasHeatWord).toBe(true);
  });
});
