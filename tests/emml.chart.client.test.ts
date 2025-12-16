// @ts-nocheck
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const clientPath = join(root, "app/_client/emml-chart-client.ts");

describe("EMML Chart Client — Contract Guard", () => {
  it("should have the EMML chart client file", () => {
    expect(existsSync(clientPath)).toBe(true);
  });

  it('should be marked as a "use client" module', () => {
    const src = readFileSync(clientPath, "utf8");
    const firstLine = src.split("\n")[0]?.trim() ?? "";
    const hasDirective =
      firstLine === '"use client";' || firstLine === "'use client';";

    expect(hasDirective).toBe(true);
  });

  it("should export fetchEmmlChart()", async () => {
    const mod = await import("../app/_client/emml-chart-client");
    expect(typeof (mod as any).fetchEmmlChart).toBe("function");
  });
});
