import type {
  CreatorRevenueEvent,
  CreatorWallet
} from "./types";

export type CreatorRevenueDashboard = {
  creatorId: string;
  balance: number;
  pending: number;
  lifetimeEarned: number;
  sourceBreakdown: Record<string, number>;
};

export function createCreatorRevenueDashboard(input: {
  wallet: CreatorWallet;
  events: CreatorRevenueEvent[];
}): CreatorRevenueDashboard {
  const sourceBreakdown = input.events.reduce<Record<string, number>>((acc, event) => {
    acc[event.source] = Number(((acc[event.source] ?? 0) + event.amount).toFixed(2));
    return acc;
  }, {});

  return {
    creatorId: input.wallet.creatorId,
    balance: input.wallet.balance,
    pending: input.wallet.pending,
    lifetimeEarned: input.wallet.lifetimeEarned,
    sourceBreakdown
  };
}
