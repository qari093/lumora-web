// @ts-nocheck
// FILE: tests/emml.state.test.ts
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const routePath = join(root, "app/api/emml/state/route.ts");

describe("EMML State Route — Contract Guard", () => {
  it("should have the EMML state route file", () => {
    expect(existsSync(routePath)).toBe(true);
  });

  it("should export GET handler", () => {
    const src = readFileSync(routePath, "utf8");
    expect(src.includes("export async function GET")).toBe(true);
  });

  it("should mention EMML state or snapshot semantics", () => {
    const src = readFileSync(routePath, "utf8").toLowerCase();
    const ok =
      src.includes("state") ||
      src.includes("snapshot") ||
      src.includes("indices") ||
      src.includes("heat") ||
      src.includes("emml");

    expect(ok).toBe(true);
  });
});