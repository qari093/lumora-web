// @ts-nocheck
// FILE: tests/emml.sse.test.ts

import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const ssePath = join(root, "app/api/emml/sse/route.ts");

describe("EMML SSE — Contract Guard", () => {
  it("should have the SSE route file", () => {
    expect(existsSync(ssePath)).toBe(true);
  });

  it("should export GET handler", () => {
    const src = readFileSync(ssePath, "utf8");
    expect(src.includes("export async function GET")).toBe(true);
  });

  it("should mention EMML or emotional markets streaming", () => {
    const src = readFileSync(ssePath, "utf8").toLowerCase();
    const ok =
      src.includes("emml") ||
      src.includes("stream") ||
      src.includes("sse") ||
      src.includes("emotion") ||
      src.includes("market");
    expect(ok).toBe(true);
  });
});