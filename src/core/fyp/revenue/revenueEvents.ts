import type {
  CreatorRevenueEvent,
  RevenueSource
} from "./types";

export function createCreatorRevenueEvent(input: {
  creatorId: string;
  source: RevenueSource;
  amount: number;
  referenceId: string;
  now?: number;
}): CreatorRevenueEvent {
  if (!input.creatorId.trim() || !input.referenceId.trim()) {
    throw new Error("Revenue event requires creatorId and referenceId.");
  }

  if (input.amount <= 0) {
    throw new Error("Revenue event amount must be positive.");
  }

  const now = input.now ?? Date.now();

  return {
    eventId: `rev_${input.creatorId}_${input.source}_${now}`,
    creatorId: input.creatorId,
    source: input.source,
    amount: Number(input.amount.toFixed(2)),
    referenceId: input.referenceId,
    createdAt: now
  };
}
