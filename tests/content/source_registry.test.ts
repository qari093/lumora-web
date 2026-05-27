import { describe, it, expect } from "vitest";
import { SOURCE_REGISTRY } from "@/src/lib/content/sources/registry";

describe("Source Registry", () => {
  it("has all sources", () => {
    expect(SOURCE_REGISTRY.length).toBeGreaterThan(40);
  });

  it("all are commercial safe", () => {
    expect(SOURCE_REGISTRY.every(s => s.commercialUse)).toBe(true);
  });
});
