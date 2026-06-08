import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  createZendoroStripeClearingTransaction,
  validateDoubleEntry,
  validateMinorAmount,
} from "../../src/core/lafs/ledger";

describe("LAFS Pack 02/08 ledger core", () => {
  it("validates minor-unit double-entry transactions", () => {
    const tx = createZendoroStripeClearingTransaction({
      stripeEventId: "evt_test_123456",
      paymentIntentId: "pi_test_123",
      amountMinor: 9900,
      currency: "EUR",
      createdAt: "2026-06-07T00:00:00.000Z",
    });

    const result = validateDoubleEntry(tx);

    expect(validateMinorAmount(9900)).toBe(true);
    expect(validateMinorAmount(99.5)).toBe(false);
    expect(result.ok).toBe(true);
    expect(result.debitMinor).toBe(9900);
    expect(result.creditMinor).toBe(9900);
  });

  it("rejects unbalanced or unsafe transactions", () => {
    const result = validateDoubleEntry({
      idempotencyKey: "bad_key_123",
      sourceReference: "pi_bad",
      description: "bad",
      createdAt: "2026-06-07T00:00:00.000Z",
      entries: [
        { accountCode: "stripe_clearing_eur", amountMinor: 1000, entryType: "debit" },
        { accountCode: "zendoro_revenue_eur", amountMinor: 900, entryType: "credit" },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("unbalanced_transaction");
  });

  it("writes ledger core audit artifacts", () => {
    expect(fs.existsSync(".lumora-audits/lafs-pack02-ledger-core.json")).toBe(true);
    expect(fs.existsSync("data/lafs/ledger-core-manifest.json")).toBe(true);
    expect(fs.existsSync("docs/lafs/pack02-ledger-core.md")).toBe(true);
    expect(fs.existsSync(".lumora_lafs_pack02_ledger_core_lock")).toBe(true);

    const audit = JSON.parse(fs.readFileSync(".lumora-audits/lafs-pack02-ledger-core.json", "utf8"));
    expect(audit.status).toBe("PASS");
    expect(audit.manifest.status).toBe("LEDGER_CORE_READY");
    expect(audit.manifest.validation.balanced).toBe(true);
  });
});
