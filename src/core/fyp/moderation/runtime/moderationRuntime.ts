import type {
  ModerationDecision,
  ModerationItem
} from "../types";

import { evaluateModeration } from "./moderationRules";
import { createModerationQueue } from "./moderationQueue";

export class ModerationRuntime {
  private readonly queue =
    createModerationQueue();

  process(
    item: ModerationItem
  ): ModerationDecision {
    const decision =
      evaluateModeration(item);

    this.queue.push(decision);

    return decision;
  }

  flush() {
    return this.queue.flush();
  }
}

export function createModerationRuntime() {
  return new ModerationRuntime();
}
