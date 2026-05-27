import type {
  GmarGameState,
  GmarRewardLedgerEntry
} from "@/src/core/gmar/state/gameState";

export type GmarZencoinWallet = {
  playerId: string;
  balance: number;
  earnedTotal: number;
  spentTotal: number;
  updatedAt: string;
};

export type GmarZencoinClaimResult = {
  state: GmarGameState;
  wallet: GmarZencoinWallet;
  ledgerEntry: GmarRewardLedgerEntry;
};

export function createGmarZencoinWallet(input: {
  playerId: string;
  now?: Date;
}): GmarZencoinWallet {
  const playerId = input.playerId.trim();

  if (!playerId) {
    throw new Error("GMAR wallet playerId is required.");
  }

  return {
    playerId,
    balance: 0,
    earnedTotal: 0,
    spentTotal: 0,
    updatedAt: (input.now ?? new Date()).toISOString()
  };
}

export function claimGmarZencoinReward(input: {
  state: GmarGameState;
  wallet?: GmarZencoinWallet;
  amount: number;
  reason: string;
  claimKey: string;
  now?: Date;
}): GmarZencoinClaimResult {
  const amount = input.amount;

  if (!Number.isInteger(amount) || amount < 1 || amount > 50) {
    throw new Error("GMAR Zencoin reward amount must be between 1 and 50.");
  }

  const claimKey = input.claimKey.trim();

  if (!claimKey) {
    throw new Error("GMAR Zencoin claimKey is required.");
  }

  const duplicate = input.state.rewards.some(
    reward => reward.id === claimKey && reward.type === "zencoin"
  );

  if (duplicate) {
    throw new Error("GMAR Zencoin reward already claimed.");
  }

  const now = input.now ?? new Date();
  const iso = now.toISOString();

  const wallet =
    input.wallet ??
    createGmarZencoinWallet({
      playerId: input.state.player.playerId,
      now
    });

  if (wallet.playerId !== input.state.player.playerId) {
    throw new Error("GMAR wallet does not match player.");
  }

  const ledgerEntry: GmarRewardLedgerEntry = {
    id: claimKey,
    type: "zencoin",
    amount,
    reason: input.reason,
    createdAt: iso
  };

  const updatedWallet: GmarZencoinWallet = {
    ...wallet,
    balance: wallet.balance + amount,
    earnedTotal: wallet.earnedTotal + amount,
    updatedAt: iso
  };

  const updatedState: GmarGameState = {
    ...input.state,
    rewards: [...input.state.rewards, ledgerEntry],
    updatedAt: iso
  };

  return {
    state: updatedState,
    wallet: updatedWallet,
    ledgerEntry
  };
}

export function assertGmarZencoinClaim(
  result: GmarZencoinClaimResult
): true {
  if (
    result.ledgerEntry.type !== "zencoin" ||
    result.ledgerEntry.amount < 1 ||
    result.wallet.balance < result.ledgerEntry.amount ||
    result.wallet.playerId !== result.state.player.playerId
  ) {
    throw new Error("Invalid GMAR Zencoin claim.");
  }

  return true;
}
