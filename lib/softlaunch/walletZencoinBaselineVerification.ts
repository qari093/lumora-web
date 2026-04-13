export type WalletBaselineRecord = {
  walletId: string;
  ownerId: string;
  currency: "ZC";
  balance: number;
  ledgerHealthy: boolean;
  transfersEnabled: boolean;
};

export type WalletZencoinBaselineVerificationInput = {
  records?: WalletBaselineRecord[] | null;
};

export type WalletZencoinBaselineVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        healthy: number;
        transferReady: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateWalletZencoinBaselineVerification(
  input: WalletZencoinBaselineVerificationInput
): WalletZencoinBaselineVerificationResult {
  const records = Array.isArray(input.records) ? input.records : [];
  if (records.length === 0) return { ok: false, reason: "missing_records" };

  const walletIds = new Set<string>();
  let healthy = 0;
  let transferReady = 0;

  for (const record of records) {
    if (!record.walletId?.trim()) return { ok: false, reason: "missing_wallet_id" };
    if (walletIds.has(record.walletId)) return { ok: false, reason: "duplicate_wallet_id" };
    walletIds.add(record.walletId);

    if (!record.ownerId?.trim()) return { ok: false, reason: "missing_owner_id" };
    if (record.currency !== "ZC") return { ok: false, reason: "invalid_currency" };
    if (!Number.isFinite(record.balance) || record.balance < 0) {
      return { ok: false, reason: "invalid_balance" };
    }

    if (record.ledgerHealthy) healthy += 1;
    if (record.transfersEnabled) transferReady += 1;
  }

  return {
    ok: true,
    verification: {
      total: records.length,
      healthy,
      transferReady,
      ready: healthy === records.length && transferReady === records.length,
    },
  };
}
