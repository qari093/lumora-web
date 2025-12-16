// @ts-nocheck
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pagePath = join(root, "app/emml/chart/page.tsx");

describe("EMML Chart UI — Live Chart Page", () => {
  it("should have the EMML chart page file", () => {
    expect(existsSync(pagePath)).toBe(true);
  });

  it("should reference fetchEmmlChart helper", () => {
    const src = readFileSync(pagePath, "utf8");
    expect(src.includes("fetchEmmlChart")).toBe(true);
  });

  it("should render with EMML Live Chart title", () => {
    const src = readFileSync(pagePath, "utf8");
    expect(src.includes("EMML Live Chart")).toBe(true);
  });
});
