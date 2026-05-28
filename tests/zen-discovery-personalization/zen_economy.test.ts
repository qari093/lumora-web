import { describe, expect, it } from "vitest";
import { canSpendZen, createZenLedgerEntry } from "@/lib/zen/zenEconomy";
import { createMemoryAnchor } from "@/lib/zen/memoryAnchor";

describe("zen economy", () => {
  it("creates safe spend and permanent memory anchor", () => {
    const entry = createZenLedgerEntry({ action: "anchor", amount: 2, reason: "memory_anchor" });
    const anchor = createMemoryAnchor("moment_1", "This mattered.");

    expect(entry.safe).toBe(true);
    expect(canSpendZen(5, 2)).toBe(true);
    expect(anchor.permanent).toBe(true);
  });
});
