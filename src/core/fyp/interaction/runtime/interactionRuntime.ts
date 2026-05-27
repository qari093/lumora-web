import type {
  InteractionEvent,
  InteractionResult
} from "../types";

import {
  scoreInteraction
} from "./interactionScorer";

export function runInteractionRuntime(
  events: InteractionEvent[]
): InteractionResult[] {
  return events
    .map(scoreInteraction)
    .sort((a, b) => b.score - a.score);
}
