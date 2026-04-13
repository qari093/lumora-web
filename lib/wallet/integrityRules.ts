export type LedgerEntryLike = {
  walletId?: string | null;
  type?: "credit" | "debit" | null;
  amount?: number | null;
  balanceBefore?: number | null;
  balanceAfter?: number | null;
  reference?: string | null;
};

export type IntegrityResult =
  | { ok: true; normalized: {
      walletId: string;
      type: "credit" | "debit";
      amount: number;
      balanceBefore: number;
      balanceAfter: number;
      reference: string;
    } }
  | { ok: false; reason: string };

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function validateCreditDebitIntegrity(entry: LedgerEntryLike): IntegrityResult {
  const walletId = typeof entry.walletId === "string" ? entry.walletId.trim() : "";
  const type = entry.type ?? null;
  const amount =
    typeof entry.amount === "number" && Number.isFinite(entry.amount)
      ? round2(entry.amount)
      : NaN;
  const balanceBefore =
    typeof entry.balanceBefore === "number" && Number.isFinite(entry.balanceBefore)
      ? round2(entry.balanceBefore)
      : NaN;
  const balanceAfter =
    typeof entry.balanceAfter === "number" && Number.isFinite(entry.balanceAfter)
      ? round2(entry.balanceAfter)
      : NaN;
  const reference = typeof entry.reference === "string" ? entry.reference.trim() : "";

  if (!walletId) return { ok: false, reason: "missing_wallet_id" };
  if (!type) return { ok: false, reason: "missing_type" };
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, reason: "invalid_amount" };
  if (!Number.isFinite(balanceBefore) || balanceBefore < 0) {
    return { ok: false, reason: "invalid_balance_before" };
  }
  if (!Number.isFinite(balanceAfter) || balanceAfter < 0) {
    return { ok: false, reason: "invalid_balance_after" };
  }
  if (!reference) return { ok: false, reason: "missing_reference" };

  const expected =
    type === "credit"
      ? round2(balanceBefore + amount)
      : round2(balanceBefore - amount);

  if (expected !== balanceAfter) {
    return { ok: false, reason: "balance_transition_mismatch" };
  }

  if (type === "debit" && balanceAfter > balanceBefore) {
    return { ok: false, reason: "debit_increased_balance" };
  }

  if (type === "credit" && balanceAfter < balanceBefore) {
    return { ok: false, reason: "credit_decreased_balance" };
  }

  return {
    ok: true,
    normalized: {
      walletId,
      type,
      amount,
      balanceBefore,
      balanceAfter,
      reference,
    },
  };
}
