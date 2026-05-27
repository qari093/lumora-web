import { describe, expect, it } from "vitest";
import { appendLedgerEntry, getLedger } from "@/src/core/zenwallet/ledger/ledger";
import { createReceiptFingerprint } from "@/src/core/zenwallet/ledger/fingerprint";

describe("ZenWallet Pack 03", () => {
  it("stores immutable ledger entries", () => {
    appendLedgerEntry({
      txId: "abcd1234",
      previousHash: null,
      amount: 100,
      balanceAfter: 100,
      createdAt: new Date().toISOString(),
    });

    expect(getLedger().length).toBeGreaterThan(0);
  });

  it("creates receipt fingerprints", () => {
    expect(createReceiptFingerprint("abcd1234")).toContain("ZP-");
  });
});
