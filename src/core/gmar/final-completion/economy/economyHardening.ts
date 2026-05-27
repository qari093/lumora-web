import type { GmarZencoinWallet } from "@/src/core/gmar/economy-active/zencoin";

export type GmarEconomyTransactionType =
  | "earn"
  | "spend"
  | "refund";

export type GmarEconomyTransaction = {
  transactionId: string;
  playerId: string;
  type: GmarEconomyTransactionType;
  amount: number;
  reason: string;
  atomic: true;
  duplicateProtected: true;
  fraudChecked: true;
  createdAt: string;
};

export type GmarEconomyResult = {
  wallet: GmarZencoinWallet;
  transaction: GmarEconomyTransaction;
};

export function spendGmarZencoin(input: {
  wallet: GmarZencoinWallet;
  amount: number;
  reason: string;
  transactionId: string;
  existingTransactionIds?: string[];
  now?: Date;
}): GmarEconomyResult {
  const amount = input.amount;
  const transactionId = input.transactionId.trim();

  if (!transactionId) {
    throw new Error("GMAR economy transactionId is required.");
  }

  if (input.existingTransactionIds?.includes(transactionId)) {
    throw new Error("GMAR economy duplicate transaction blocked.");
  }

  if (!Number.isInteger(amount) || amount < 1 || amount > 100) {
    throw new Error("GMAR economy spend amount must be between 1 and 100.");
  }

  if (input.wallet.balance < amount) {
    throw new Error("GMAR economy insufficient balance.");
  }

  const iso = (input.now ?? new Date()).toISOString();

  const wallet: GmarZencoinWallet = {
    ...input.wallet,
    balance: input.wallet.balance - amount,
    spentTotal: input.wallet.spentTotal + amount,
    updatedAt: iso
  };

  return {
    wallet,
    transaction: {
      transactionId,
      playerId: input.wallet.playerId,
      type: "spend",
      amount,
      reason: input.reason,
      atomic: true,
      duplicateProtected: true,
      fraudChecked: true,
      createdAt: iso
    }
  };
}

export function refundGmarZencoin(input: {
  wallet: GmarZencoinWallet;
  amount: number;
  reason: string;
  transactionId: string;
  now?: Date;
}): GmarEconomyResult {
  if (!Number.isInteger(input.amount) || input.amount < 1 || input.amount > 100) {
    throw new Error("GMAR economy refund amount must be between 1 and 100.");
  }

  const transactionId = input.transactionId.trim();

  if (!transactionId) {
    throw new Error("GMAR economy transactionId is required.");
  }

  const iso = (input.now ?? new Date()).toISOString();

  return {
    wallet: {
      ...input.wallet,
      balance: input.wallet.balance + input.amount,
      updatedAt: iso
    },
    transaction: {
      transactionId,
      playerId: input.wallet.playerId,
      type: "refund",
      amount: input.amount,
      reason: input.reason,
      atomic: true,
      duplicateProtected: true,
      fraudChecked: true,
      createdAt: iso
    }
  };
}

export function assertGmarEconomyTransaction(
  result: GmarEconomyResult
): true {
  if (
    !result.transaction.transactionId ||
    !result.transaction.playerId ||
    result.transaction.amount < 1 ||
    result.transaction.atomic !== true ||
    result.transaction.duplicateProtected !== true ||
    result.transaction.fraudChecked !== true ||
    result.wallet.balance < 0
  ) {
    throw new Error("Invalid GMAR economy transaction.");
  }

  return true;
}
