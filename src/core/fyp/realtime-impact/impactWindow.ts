import type {
  ImpactWindow,
  RealtimeImpactSignal
} from "./types";

export function createImpactWindow(input: {
  contentId: string;
  creatorId: string;
  windowSeconds?: number;
  signals?: RealtimeImpactSignal[];
}): ImpactWindow {
  if (!input.contentId.trim() || !input.creatorId.trim()) {
    throw new Error("Impact window requires contentId and creatorId.");
  }

  return {
    contentId: input.contentId,
    creatorId: input.creatorId,
    windowSeconds: input.windowSeconds ?? 60,
    signals: input.signals ?? []
  };
}

export function addImpactSignal(input: {
  window: ImpactWindow;
  signal: RealtimeImpactSignal;
}): ImpactWindow {
  if (
    input.window.contentId !== input.signal.contentId ||
    input.window.creatorId !== input.signal.creatorId
  ) {
    throw new Error("Impact signal/window mismatch.");
  }

  return {
    ...input.window,
    signals: [...input.window.signals, input.signal]
  };
}
