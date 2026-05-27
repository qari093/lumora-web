import { describe, expect, it } from "vitest";
import { buildEventsFallback } from "../../src/lib/native-fyp/runtime/fallback";
import { ensureNonEmptyFeed } from "../../src/lib/native-fyp/runtime/emptyGuard";
import { adjustTrustScore } from "../../src/lib/native-fyp/runtime/trust";

describe("native fyp pack 015", () => {
  it("fallback generates items", () => {
    const items = buildEventsFallback();
    expect(items.length).toBeGreaterThan(0);
  });

  it("empty feed replaced", () => {
    const out = ensureNonEmptyFeed([]);
    expect(out.length).toBeGreaterThan(0);
  });

  it("trust decreases on failure", () => {
    const t = adjustTrustScore(0.5, true);
    expect(t).toBeLessThan(0.5);
  });

  it("trust increases on success", () => {
    const t = adjustTrustScore(0.5, false);
    expect(t).toBeGreaterThan(0.5);
  });
});
