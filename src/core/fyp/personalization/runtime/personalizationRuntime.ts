import type {
  PersonalizationDecision,
  PersonalizationSignal
} from "../types";

import { buildPersonalizationProfile } from "./profileBuilder";
import { personalizeScore } from "./scorePersonalizer";

export class FypPersonalizationRuntime {
  private readonly signals: PersonalizationSignal[] = [];

  ingest(signal: PersonalizationSignal): number {
    this.signals.push(signal);
    return this.signals.length;
  }

  decide(
    userId: string,
    itemId: string,
    baseScore: number
  ): PersonalizationDecision {
    const profile = buildPersonalizationProfile(
      userId,
      this.signals
    );

    return personalizeScore(
      profile,
      itemId,
      baseScore
    );
  }

  count(): number {
    return this.signals.length;
  }
}

export function createFypPersonalizationRuntime() {
  return new FypPersonalizationRuntime();
}
