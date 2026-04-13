export type TransactionIdCheckInput = {
  transactionId: string;
  existingIds?: string[];
};

export type TransactionIdCheckResult = {
  valid: boolean;
  duplicate: boolean;
  reason: "ok" | "duplicate_transaction_id" | "invalid_transaction_id";
};

export function checkTransactionId(input: TransactionIdCheckInput): TransactionIdCheckResult {
  const txid = typeof input.transactionId === "string" ? input.transactionId.trim() : "";
  const existingIds = Array.isArray(input.existingIds) ? input.existingIds : [];

  if (!txid || !txid.startsWith("txn_")) {
    return {
      valid: false,
      duplicate: false,
      reason: "invalid_transaction_id",
    };
  }

  if (existingIds.includes(txid)) {
    return {
      valid: false,
      duplicate: true,
      reason: "duplicate_transaction_id",
    };
  }

  return {
    valid: true,
    duplicate: false,
    reason: "ok",
  };
}
