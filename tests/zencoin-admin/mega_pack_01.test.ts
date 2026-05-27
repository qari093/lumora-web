import { describe, expect, it } from "vitest";

import { createWalletRuntime } from "@/src/core/zencoin/wallet/walletRuntime";
import { createLedgerEntry } from "@/src/core/zencoin/ledger/ledgerRuntime";
import { createIdempotencyKey } from "@/src/core/zencoin/idempotency/idempotency";
import { createAuditEvent } from "@/src/core/zencoin/runtime/auditRuntime";

describe("Zencoin/Admin Mega Pack 01", () => {
  it("creates wallet runtime", () => {
    expect(createWalletRuntime().active).toBe(true);
  });

  it("creates ledger entry", () => {
    expect(createLedgerEntry(10, 10).debit).toBe(10);
  });

  it("creates idempotency key", () => {
    expect(createIdempotencyKey("abc")).toContain("stable");
  });

  it("creates audit event", () => {
    expect(createAuditEvent("transfer").action).toBe("transfer");
  });
});
