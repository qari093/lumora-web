import type {
  RetentionProfile,
  RetentionSignal
} from "../types";

import { validateRetentionSignal } from "../contracts/retentionContract";
import { createRetentionStore } from "./retentionStore";
import { buildRetentionProfile } from "./retentionProfile";

export class RetentionRuntime {
  private readonly store =
    createRetentionStore();

  track(
    signal: RetentionSignal
  ): number {
    if (!validateRetentionSignal(signal)) {
      throw new Error(
        "invalid_retention_signal"
      );
    }

    return this.store.track(signal);
  }

  profile(
    userId: string
  ): RetentionProfile {
    const signals =
      this.store
        .all()
        .filter((s) => s.userId === userId);

    return buildRetentionProfile(
      userId,
      signals
    );
  }
}

export function createRetentionRuntime() {
  return new RetentionRuntime();
}
