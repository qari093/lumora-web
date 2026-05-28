import { describe, it, expect } from "vitest";
import { getLegalSeedSources } from "@/lib/seed/legalSeedSources";

describe("civilization foundation", () => {
  it("has legal seed sources", () => {
    expect(getLegalSeedSources().length).toBeGreaterThan(5);
  });
});
