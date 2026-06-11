import {
  buildFypRuntimeUiState
} from "@/src/core/fyp/runtime-ui/fypRuntimeUi";

export type FypRuntimeTrackingEventType =
  | "impression"
  | "view"
  | "watch_progress"
  | "like"
  | "save"
  | "share"
  | "skip";

export type FypRuntimeTrackingEvent = {
  id: string;
  type: FypRuntimeTrackingEventType;
  cardId: string;
  sourceId: string;
  playbackLane: "native_video" | "official_embed";
  traceLane: string;
  createdAt: string;
  value: number;
};

function stableEventId(parts: string[]): string {
  return parts
    .join(":")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function createFypRuntimeTrackingEvent(
  type: FypRuntimeTrackingEventType,
  cardId: string,
  value = 1
): FypRuntimeTrackingEvent {
  const state = buildFypRuntimeUiState();
  const card = state.cards.find((item) => item.id === cardId) ?? state.activeCard;

  if (!card) {
    throw new Error("FYP_TRACKING_CARD_NOT_FOUND");
  }

  return {
    id: stableEventId(["fyp-track", type, card.id]),
    type,
    cardId: card.id,
    sourceId: card.sourceId,
    playbackLane: card.lane,
    traceLane: card.traceLane,
    createdAt: new Date(0).toISOString(),
    value: Math.max(0, Math.min(value, 1))
  };
}

export function buildFypRuntimeTrackingBatch(): FypRuntimeTrackingEvent[] {
  const state = buildFypRuntimeUiState();

  if (!state.activeCard) return [];

  return [
    createFypRuntimeTrackingEvent("impression", state.activeCard.id, 1),
    createFypRuntimeTrackingEvent("view", state.activeCard.id, 1),
    createFypRuntimeTrackingEvent("watch_progress", state.activeCard.id, 0.5)
  ];
}

export function validateFypRuntimeTrackingIntegration(): boolean {
  const batch = buildFypRuntimeTrackingBatch();

  return (
    batch.length === 3 &&
    batch.some((event) => event.type === "impression") &&
    batch.some((event) => event.type === "view") &&
    batch.some((event) => event.type === "watch_progress") &&
    batch.every((event) =>
      Boolean(event.id) &&
      Boolean(event.cardId) &&
      Boolean(event.sourceId) &&
      ["native_video", "official_embed"].includes(event.playbackLane) &&
      event.value >= 0 &&
      event.value <= 1
    )
  );
}
