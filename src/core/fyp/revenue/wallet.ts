import type {
  CreatorRevenueEvent,
  CreatorWallet
} from "./types";

export function createCreatorWallet(
  creatorId: string
): CreatorWallet {
  if (!creatorId.trim()) {
    throw new Error("Creator wallet requires creatorId.");
  }

  return {
    creatorId,
    balance: 0,
    pending: 0,
    lifetimeEarned: 0,
    eventCount: 0
  };
}

export function applyRevenueEvent(input: {
  wallet: CreatorWallet;
  event: CreatorRevenueEvent;
}): CreatorWallet {
  if (input.wallet.creatorId !== input.event.creatorId) {
    throw new Error("Creator wallet/event mismatch.");
  }

  return {
    ...input.wallet,
    pending: input.wallet.pending + input.event.amount,
    lifetimeEarned: input.wallet.lifetimeEarned + input.event.amount,
    eventCount: input.wallet.eventCount + 1
  };
}
