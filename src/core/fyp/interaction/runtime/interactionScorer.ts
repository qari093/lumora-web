import type {
  InteractionEvent,
  InteractionResult
} from "../types";

import {
  validateInteractionEvent
} from "../contracts/interactionContract";

const WEIGHTS = {
  tap: 1,
  hold: 2,
  swipe: 1.5,
  reaction: 3,
  share: 5
} as const;

export function scoreInteraction(
  event: InteractionEvent
): InteractionResult {
  if (!validateInteractionEvent(event)) {
    throw new Error("invalid_interaction_event");
  }

  const score = event.strength * WEIGHTS[event.type];

  return {
    itemId: event.itemId,
    score,
    intent: score >= 15 ? "strong_interest" : "light_interest"
  };
}
