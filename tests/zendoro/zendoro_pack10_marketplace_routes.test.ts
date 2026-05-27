import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Zendoro Pack 10/12 — Marketplace Routes", () => {
  it("has marketplace route", () => {
    expect(fs.existsSync("app/zendoro/page.tsx")).toBe(true);
  });

  it("has product route", () => {
    expect(fs.existsSync("app/zendoro/product/[id]/page.tsx")).toBe(true);
  });

  it("has cart route", () => {
    expect(fs.existsSync("app/zendoro/cart/page.tsx")).toBe(true);
  });
});
