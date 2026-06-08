import { LAFS_ACCOUNT_SEEDS, LAFS_PRE_BETA_GUARDS } from "./foundation";

export type LedgerEntryType = "debit" | "credit";

export interface LafsLedgerEntry {
  accountCode: string;
  amountMinor: number;
  entryType: LedgerEntryType;
}

export interface LafsLedgerTransaction {
  idempotencyKey: string;
  sourceReference: string;
  description: string;
  entries: LafsLedgerEntry[];
  createdAt: string;
}

export interface LafsLedgerValidationResult {
  ok: boolean;
  debitMinor: number;
  creditMinor: number;
  errors: string[];
}

export function validateMinorAmount(amountMinor: number): boolean {
  return Number.isInteger(amountMinor) && amountMinor > 0 && Number.isSafeInteger(amountMinor);
}

export function validateDoubleEntry(transaction: LafsLedgerTransaction): LafsLedgerValidationResult {
  const accountCodes = new Set(LAFS_ACCOUNT_SEEDS.map((account) => account.code));
  const errors: string[] = [];

  if (!transaction.idempotencyKey || transaction.idempotencyKey.trim().length < 8) {
    errors.push("idempotency_key_required");
  }

  if (!transaction.sourceReference || transaction.sourceReference.trim().length < 3) {
    errors.push("source_reference_required");
  }

  if (!Array.isArray(transaction.entries) || transaction.entries.length < 2) {
    errors.push("minimum_two_entries_required");
  }

  let debitMinor = 0;
  let creditMinor = 0;

  for (const entry of transaction.entries || []) {
    if (!accountCodes.has(entry.accountCode)) {
      errors.push(`unknown_account:${entry.accountCode}`);
    }

    if (!validateMinorAmount(entry.amountMinor)) {
      errors.push(`invalid_amount:${entry.accountCode}`);
    }

    if (entry.entryType === "debit") debitMinor += entry.amountMinor;
    else if (entry.entryType === "credit") creditMinor += entry.amountMinor;
    else errors.push(`invalid_entry_type:${entry.accountCode}`);
  }

  if (debitMinor !== creditMinor) {
    errors.push("unbalanced_transaction");
  }

  if (LAFS_PRE_BETA_GUARDS.paymentLiveMode !== false) {
    errors.push("payment_live_mode_must_remain_false_pre_beta");
  }

  return {
    ok: errors.length === 0,
    debitMinor,
    creditMinor,
    errors,
  };
}

export function createZendoroStripeClearingTransaction(input: {
  stripeEventId: string;
  paymentIntentId: string;
  amountMinor: number;
  currency: "EUR";
  createdAt?: string;
}): LafsLedgerTransaction {
  if (!validateMinorAmount(input.amountMinor)) {
    throw new Error("amount_minor_must_be_positive_safe_integer");
  }

  return {
    idempotencyKey: `stripe:${input.stripeEventId}`,
    sourceReference: input.paymentIntentId,
    description: `Zendoro Stripe payment clearing ${input.paymentIntentId}`,
    createdAt: input.createdAt ?? new Date().toISOString(),
    entries: [
      {
        accountCode: "stripe_clearing_eur",
        amountMinor: input.amountMinor,
        entryType: "debit",
      },
      {
        accountCode: "zendoro_revenue_eur",
        amountMinor: input.amountMinor,
        entryType: "credit",
      },
    ],
  };
}
