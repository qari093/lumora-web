import type {
  ImpactSignalType,
  RealtimeImpactSignal
} from "./types";

const SIGNAL_WEIGHT: Record<ImpactSignalType, number> = {
  view: 1,
  echo: 5,
  capsule_save: 12,
  share: 9,
  replay: 6,
  rush_hold: 8
};

export function createRealtimeImpactSignal(input: {
  contentId: string;
  creatorId: string;
  type: ImpactSignalType;
  now?: number;
}): RealtimeImpactSignal {
  if (!input.contentId.trim() || !input.creatorId.trim()) {
    throw new Error("Realtime impact signal requires contentId and creatorId.");
  }

  const now = input.now ?? Date.now();

  return {
    signalId: `impact_${input.contentId}_${input.type}_${now}`,
    contentId: input.contentId,
    creatorId: input.creatorId,
    type: input.type,
    weight: SIGNAL_WEIGHT[input.type],
    createdAt: now
  };
}
