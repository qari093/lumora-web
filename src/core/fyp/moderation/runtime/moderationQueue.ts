import type { ModerationDecision } from "../types";

export class ModerationQueue {
  private readonly items: ModerationDecision[] = [];

  push(
    decision: ModerationDecision
  ): number {
    this.items.push(decision);
    return this.items.length;
  }

  flush(): ModerationDecision[] {
    const snapshot = [...this.items];
    this.items.length = 0;
    return snapshot;
  }

  size(): number {
    return this.items.length;
  }
}

export function createModerationQueue() {
  return new ModerationQueue();
}
