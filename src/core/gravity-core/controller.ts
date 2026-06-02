import { DEFAULT_GRAVITY_MODE, DEFAULT_GRAVITY_THRESHOLDS, isGravityCoreShadowEnabled } from "./config";
import { computeGravityIntent } from "./intentEngine";
import type { GravityIntentResult, GravityMode, GravityRuntimeInput, GravitySample, GravityState } from "./types";

export class GravityCoreController {
  private previous?: GravitySample;
  private state: GravityState = "idle";
  private mode: GravityMode;
  private repeatedAttempts = 0;
  private lastIntentAt = 0;

  constructor(mode: GravityMode = DEFAULT_GRAVITY_MODE) {
    this.mode = isGravityCoreShadowEnabled() ? mode : "off";
  }

  getState(): GravityState {
    return this.state;
  }

  getMode(): GravityMode {
    return this.mode;
  }

  setMode(mode: GravityMode): void {
    this.mode = mode;
  }

  sample(current: GravitySample, extra: Partial<GravityRuntimeInput> = {}): GravityIntentResult {
    if (this.mode === "off") {
      this.previous = current;
      this.state = "idle";
      return {
        state: "idle",
        direction: "none",
        velocity: 0,
        proximity: 0,
        intentScore: 0,
        confidence: 0,
        shadowOnly: true,
        shouldShowRing: false,
        shouldNavigate: false,
      };
    }

    const result = computeGravityIntent(
      {
        previous: this.previous,
        current,
        repeatedAttempts: this.repeatedAttempts,
        ...extra,
      },
      DEFAULT_GRAVITY_THRESHOLDS,
    );

    if (result.state === "intent") {
      this.repeatedAttempts += 1;
      this.lastIntentAt = current.timestamp;
    } else if (current.timestamp - this.lastIntentAt > 2500) {
      this.repeatedAttempts = 0;
    }

    this.previous = current;
    this.state = result.state;

    return {
      ...result,
      shadowOnly: this.mode === "shadow",
      shouldNavigate: false,
    };
  }

  reset(): void {
    this.previous = undefined;
    this.state = "idle";
    this.repeatedAttempts = 0;
    this.lastIntentAt = 0;
  }
}
