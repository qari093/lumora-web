export type LedgerEntry = {
  id: string;
  walletId: string;
  type: "credit" | "debit";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference: string;
  createdAt: number;
};

export type HardenLedgerInput = {
  walletId?: string | null;
  type?: "credit" | "debit" | null;
  amount?: number | null;
  balanceBefore?: number | null;
  reference?: string | null;
};

export type HardenLedgerResult =
  | { ok: true; entry: LedgerEntry }
  | { ok: false; reason: string };

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function createHardenedLedgerEntry(
  input: HardenLedgerInput,
  now: number = Date.now()
): HardenLedgerResult {
  const walletId = typeof input.walletId === "string" ? input.walletId.trim() : "";
  const type = input.type ?? null;
  const amount = typeof input.amount === "number" ? round2(input.amount) : NaN;
  const balanceBefore =
    typeof input.balanceBefore === "number" ? round2(input.balanceBefore) : NaN;
  const reference = typeof input.reference === "string" ? input.reference.trim() : "";

  if (!walletId) return { ok: false, reason: "missing_wallet_id" };
  if (!type) return { ok: false, reason: "missing_type" };
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, reason: "invalid_amount" };
  if (!Number.isFinite(balanceBefore) || balanceBefore < 0) {
    return { ok: false, reason: "invalid_balance_before" };
  }
  if (!reference) return { ok: false, reason: "missing_reference" };

  const signedAmount = type === "credit" ? amount : -amount;
  const balanceAfter = round2(balanceBefore + signedAmount);

  if (balanceAfter < 0) return { ok: false, reason: "insufficient_balance" };

  return {
    ok: true,
    entry: {
      id: `led_${Math.random().toString(36).slice(2, 10)}`,
      walletId,
      type,
      amount,
      balanceBefore,
      balanceAfter,
      reference,
      createdAt: now,
    },
  };
}
