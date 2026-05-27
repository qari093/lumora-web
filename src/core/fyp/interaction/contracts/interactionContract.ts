import type {
  InteractionEvent,
  InteractionType
} from "../types";

const TYPES: InteractionType[] = [
  "tap",
  "hold",
  "swipe",
  "reaction",
  "share"
];

export function validateInteractionEvent(
  event: InteractionEvent
): boolean {
  return Boolean(
    event.id &&
      event.itemId &&
      TYPES.includes(event.type) &&
      Number.isFinite(event.strength) &&
      event.strength >= 0
  );
}
