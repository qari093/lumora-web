// @ts-nocheck
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dashEmmlPath = join(root, "app", "dash", "emml", "page.tsx");
const heatPath = join(root, "app", "dash", "emml", "heat", "page.tsx");

describe("EMML UI — Dashboard Contract Guard", () => {
  it("should have EMML dashboard page file", () => {
    expect(existsSync(dashEmmlPath)).toBe(true);
  });

  it("should have EMML heat view page file", () => {
    expect(existsSync(heatPath)).toBe(true);
  });

  it("dashboard page should reference EMML indices or markets", () => {
    const src = readFileSync(dashEmmlPath, "utf8").toLowerCase();
    const ok =
      src.includes("emml") ||
      src.includes("indices") ||
      src.includes("markets") ||
      src.includes("micro-market");

    expect(ok).toBe(true);
  });

  it("heat view page should reference EMML heat or heatmap client", () => {
    const src = readFileSync(heatPath, "utf8").toLowerCase();
    const ok =
      src.includes("emml") ||
      src.includes("heat") ||
      src.includes("heatmap") ||
      src.includes("emotional");

    expect(ok).toBe(true);
  });
});
