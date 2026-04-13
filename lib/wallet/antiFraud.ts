export type WalletFraudInput = {
  walletId?: string | null;
  userId?: string | null;
  amount?: number | null;
  type?: "credit" | "debit" | null;
  reference?: string | null;
  recentTxnCount?: number | null;
  dailyTotal?: number | null;
  ipHash?: string | null;
  deviceId?: string | null;
};

export type WalletFraudResult =
  | {
      ok: true;
      riskScore: number;
      flags: string[];
    }
  | {
      ok: false;
      reason: string;
      riskScore: number;
      flags: string[];
    };

const MAX_SINGLE_TXN = 100_000;
const MAX_DAILY_TOTAL = 250_000;
const MAX_RECENT_TXN_COUNT = 25;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function runWalletAntiFraudChecks(input: WalletFraudInput): WalletFraudResult {
  const walletId = typeof input.walletId === "string" ? input.walletId.trim() : "";
  const userId = typeof input.userId === "string" ? input.userId.trim() : "";
  const reference = typeof input.reference === "string" ? input.reference.trim() : "";
  const ipHash = typeof input.ipHash === "string" ? input.ipHash.trim() : "";
  const deviceId = typeof input.deviceId === "string" ? input.deviceId.trim() : "";
  const type = input.type ?? null;
  const amount =
    typeof input.amount === "number" && Number.isFinite(input.amount)
      ? round2(input.amount)
      : NaN;
  const recentTxnCount =
    typeof input.recentTxnCount === "number" && Number.isFinite(input.recentTxnCount)
      ? input.recentTxnCount
      : NaN;
  const dailyTotal =
    typeof input.dailyTotal === "number" && Number.isFinite(input.dailyTotal)
      ? round2(input.dailyTotal)
      : NaN;

  const flags: string[] = [];
  let riskScore = 0;

  if (!walletId) return { ok: false, reason: "missing_wallet_id", riskScore: 100, flags: ["missing_wallet_id"] };
  if (!userId) return { ok: false, reason: "missing_user_id", riskScore: 100, flags: ["missing_user_id"] };
  if (!type) return { ok: false, reason: "missing_type", riskScore: 100, flags: ["missing_type"] };
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, reason: "invalid_amount", riskScore: 100, flags: ["invalid_amount"] };
  }
  if (!reference) return { ok: false, reason: "missing_reference", riskScore: 100, flags: ["missing_reference"] };

  if (amount > MAX_SINGLE_TXN) {
    flags.push("high_single_transaction");
    riskScore += 45;
  }

  if (Number.isFinite(dailyTotal) && dailyTotal > MAX_DAILY_TOTAL) {
    flags.push("daily_total_limit_exceeded");
    riskScore += 35;
  }

  if (Number.isFinite(recentTxnCount) && recentTxnCount > MAX_RECENT_TXN_COUNT) {
    flags.push("high_transaction_velocity");
    riskScore += 30;
  }

  if (!ipHash) {
    flags.push("missing_ip_hash");
    riskScore += 10;
  }

  if (!deviceId) {
    flags.push("missing_device_id");
    riskScore += 10;
  }

  if (/bonus|reward|promo/i.test(reference) && type === "debit") {
    flags.push("reference_type_mismatch");
    riskScore += 20;
  }

  if (/withdraw|cashout/i.test(reference) && type === "credit") {
    flags.push("reference_type_mismatch");
    riskScore += 20;
  }

  riskScore = Math.min(100, riskScore);

  if (riskScore >= 60) {
    return {
      ok: false,
      reason: "fraud_risk_blocked",
      riskScore,
      flags,
    };
  }

  return {
    ok: true,
    riskScore,
    flags,
  };
}
