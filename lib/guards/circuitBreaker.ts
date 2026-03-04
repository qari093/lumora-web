export type BreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export type BreakerConfig = Readonly<{
  name: string;
  // open after N consecutive failures while CLOSED
  failureThreshold: number;
  // open duration (ms) before attempting HALF_OPEN
  openForMs: number;
  // while HALF_OPEN, allow exactly this many probes; if all succeed -> CLOSED; any fail -> OPEN
  halfOpenProbes: number;
}>;

export type BreakerSnapshot = Readonly<{
  name: string;
  state: BreakerState;
  openedAt: number | null;
  consecutiveFailures: number;
  halfOpenRemaining: number;
}>;

export type BreakerAllow = Readonly<{ ok: true; state: BreakerState }>;
export type BreakerBlock = Readonly<{ ok: false; state: BreakerState; retryAfterMs: number }>;

export class CircuitBreaker {
  private cfg: BreakerConfig;
  private state: BreakerState = "CLOSED";
  private openedAt: number | null = null;
  private consecutiveFailures = 0;
  private halfOpenRemaining = 0;

  constructor(cfg: BreakerConfig) {
    if (!cfg?.name) throw new Error("breaker_name_required");
    if (!Number.isFinite(cfg.failureThreshold) || cfg.failureThreshold < 1) throw new Error("failureThreshold_invalid");
    if (!Number.isFinite(cfg.openForMs) || cfg.openForMs < 1) throw new Error("openForMs_invalid");
    if (!Number.isFinite(cfg.halfOpenProbes) || cfg.halfOpenProbes < 1) throw new Error("halfOpenProbes_invalid");
    this.cfg = cfg;
  }

  snapshot(): BreakerSnapshot {
    return {
      name: this.cfg.name,
      state: this.state,
      openedAt: this.openedAt,
      consecutiveFailures: this.consecutiveFailures,
      halfOpenRemaining: this.halfOpenRemaining,
    };
  }

  // Gate call before executing the protected action.
  allow(nowMs: number = Date.now()): BreakerAllow | BreakerBlock {
    if (this.state === "CLOSED") return { ok: true, state: "CLOSED" };

    if (this.state === "OPEN") {
      const openedAt = this.openedAt ?? nowMs;
      const elapsed = nowMs - openedAt;
      if (elapsed >= this.cfg.openForMs) {
        // transition to HALF_OPEN
        this.state = "HALF_OPEN";
        this.halfOpenRemaining = this.cfg.halfOpenProbes;
        return { ok: true, state: "HALF_OPEN" };
      }
      return { ok: false, state: "OPEN", retryAfterMs: Math.max(0, this.cfg.openForMs - elapsed) };
    }

    // HALF_OPEN
    if (this.halfOpenRemaining <= 0) {
      // safety: should never happen, reset to CLOSED
      this.state = "CLOSED";
      this.consecutiveFailures = 0;
      this.openedAt = null;
      return { ok: true, state: "CLOSED" };
    }
    return { ok: true, state: "HALF_OPEN" };
  }

  // Report outcome after executing the protected action.
  reportSuccess(): void {
    if (this.state === "HALF_OPEN") {
      this.halfOpenRemaining -= 1;
      if (this.halfOpenRemaining <= 0) {
        // all probes succeeded
        this.state = "CLOSED";
        this.consecutiveFailures = 0;
        this.openedAt = null;
        this.halfOpenRemaining = 0;
      }
      return;
    }
    // CLOSED success resets failures
    this.consecutiveFailures = 0;
  }

  reportFailure(nowMs: number = Date.now()): void {
    if (this.state === "HALF_OPEN") {
      // any failure during HALF_OPEN -> OPEN again
      this.state = "OPEN";
      this.openedAt = nowMs;
      this.consecutiveFailures = this.cfg.failureThreshold; // indicate "tripped"
      this.halfOpenRemaining = 0;
      return;
    }

    // CLOSED -> increment; trip when threshold reached
    this.consecutiveFailures += 1;
    if (this.consecutiveFailures >= this.cfg.failureThreshold) {
      this.state = "OPEN";
      this.openedAt = nowMs;
      this.halfOpenRemaining = 0;
    }
  }
}
