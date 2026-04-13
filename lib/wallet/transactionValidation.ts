export type WalletTransactionInput = {
  walletId?: string | null;
  transactionId?: string | null;
  type?: "credit" | "debit" | null;
  amount?: number | null;
  currency?: string | null;
  reference?: string | null;
  createdAt?: number | null;
};

export type WalletTransactionValidationResult =
  | { ok: true; normalized: {
      walletId: string;
      transactionId: string;
      type: "credit" | "debit";
      amount: number;
      currency: string;
      reference: string;
      createdAt: number;
    } }
  | { ok: false; reason: string };

const MAX_AMOUNT = 1_000_000;
const ALLOWED_CURRENCIES = new Set(["ZC", "ZENCOIN", "ZENCOIN+"]);

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function validateWalletTransaction(
  input: WalletTransactionInput,
  now: number = Date.now()
): WalletTransactionValidationResult {
  const walletId = typeof input.walletId === "string" ? input.walletId.trim() : "";
  const transactionId =
    typeof input.transactionId === "string" ? input.transactionId.trim() : "";
  const type = input.type ?? null;
  const amount =
    typeof input.amount === "number" && Number.isFinite(input.amount)
      ? round2(input.amount)
      : NaN;
  const currency = typeof input.currency === "string" ? input.currency.trim().toUpperCase() : "";
  const reference = typeof input.reference === "string" ? input.reference.trim() : "";
  const createdAt =
    typeof input.createdAt === "number" && Number.isFinite(input.createdAt)
      ? input.createdAt
      : NaN;

  if (!walletId) return { ok: false, reason: "missing_wallet_id" };
  if (!transactionId) return { ok: false, reason: "missing_transaction_id" };
  if (!type) return { ok: false, reason: "missing_type" };
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, reason: "invalid_amount" };
  }
  if (amount > MAX_AMOUNT) return { ok: false, reason: "amount_exceeds_limit" };
  if (!currency) return { ok: false, reason: "missing_currency" };
  if (!ALLOWED_CURRENCIES.has(currency)) {
    return { ok: false, reason: "invalid_currency" };
  }
  if (!reference) return { ok: false, reason: "missing_reference" };
  if (!Number.isFinite(createdAt) || createdAt <= 0) {
    return { ok: false, reason: "invalid_created_at" };
  }
  if (createdAt > now + 60_000) {
    return { ok: false, reason: "created_at_in_future" };
  }

  return {
    ok: true,
    normalized: {
      walletId,
      transactionId,
      type,
      amount,
      currency,
      reference,
      createdAt,
    },
  };
}
