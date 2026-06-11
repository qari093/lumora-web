import { describe, expect, it } from "vitest";

import {
  getFypSourceFailoverChain,
  selectFypSources,
  validateFypSourceSelectionFailoverRuntime
} from "@/src/core/fyp/sources/sourceSelection";

describe("FYP Mega Pack 03 — Source Selection & Failover Runtime", () => {
  it("selects eligible global sources with fallback coverage", () => {
    const result = selectFypSources({ maxSources: 8 });

    expect(result.selected).toHaveLength(8);
    expect(result.fallbacks).toHaveLength(8);
    expect(result.rejected).toHaveLength(0);
  });

  it("supports category-scoped source selection", () => {
    const result = selectFypSources({ category: "space", maxSources: 3 });

    expect(result.selected.length).toBeGreaterThan(0);
    expect(result.selected.every((source) => source.category === "space")).toBe(true);
  });

  it("keeps embed/link-only preference safe", () => {
    const result = selectFypSources({ preferEmbedOnly: true, maxSources: 4 });

    expect(result.selected.length).toBeGreaterThan(0);
    expect(
      result.selected.every((source) =>
        source.ingestionMode.includes("embed") || source.ingestionMode.includes("link")
      )
    ).toBe(true);
  });

  it("creates same-category failover chain for a known source", () => {
    const chain = getFypSourceFailoverChain("NASA");

    expect(chain.length).toBeGreaterThanOrEqual(2);
    expect(chain[0]?.id).toBe("NASA");
  });

  it("creates global failover chain for unknown source", () => {
    const chain = getFypSourceFailoverChain("UNKNOWN_SOURCE");

    expect(chain).toHaveLength(5);
  });

  it("validates complete source selection and failover runtime", () => {
    expect(validateFypSourceSelectionFailoverRuntime()).toBe(true);
  });
});
