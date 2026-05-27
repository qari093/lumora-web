import { describe, expect, it } from "vitest";
import {
  emotionalLedger,
  createLedgerEntry,
  ledgerHealthy
} from "@/core/zencoin/ledger/ledgerArchitecture";

describe("Zencoin Pack 03 — Ledger Architecture", () => {
  it("supports immutable ledger", () => {
    expect(emotionalLedger.immutable).toBe(true);
  });

  it("supports debit and credit", () => {
    const entry = createLedgerEntry();

    expect(entry.debit).toBe("wallet");
    expect(entry.credit).toBe("marketplace");
  });

  it("supports ledger health", () => {
    expect(ledgerHealthy()).toBe(true);
  });
});
