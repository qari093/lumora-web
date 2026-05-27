import type {
  RetentionSignal
} from "../types";

export class RetentionStore {
  private readonly signals: RetentionSignal[] = [];

  track(
    signal: RetentionSignal
  ): number {
    this.signals.push(signal);
    return this.signals.length;
  }

  all(): RetentionSignal[] {
    return [...this.signals];
  }

  count(): number {
    return this.signals.length;
  }
}

export function createRetentionStore() {
  return new RetentionStore();
}
