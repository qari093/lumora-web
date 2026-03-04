import { describe, it, expect } from "vitest";
import { CircuitBreaker } from "@/lib/guards/circuitBreaker";

describe("circuit breaker (contract)", () => {
  it("opens after threshold failures and blocks until openForMs passes", () => {
    const b = new CircuitBreaker({ name: "edge-segment-sign", failureThreshold: 2, openForMs: 1000, halfOpenProbes: 2 });

    expect(b.allow(0).ok).toBe(true);
    b.reportFailure(0);
    expect(b.allow(0).ok).toBe(true);
    b.reportFailure(10);

    const blocked = b.allow(100);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.retryAfterMs).toBeGreaterThan(0);

    const half = b.allow(1010);
    expect(half.ok).toBe(true);
    expect(half.state).toBe("HALF_OPEN");
  });

  it("half-open: any failure returns to open; successes close after probes", () => {
    const b = new CircuitBreaker({ name: "manifest-auth", failureThreshold: 1, openForMs: 500, halfOpenProbes: 2 });

    b.reportFailure(0);
    expect(b.allow(1).ok).toBe(false);

    // move to half-open
    const a1 = b.allow(600);
    expect(a1.ok).toBe(true);
    if (a1.ok) expect(a1.state).toBe("HALF_OPEN");

    // fail probe -> open
    b.reportFailure(650);
    const blocked = b.allow(700);
    expect(blocked.ok).toBe(false);

    // half-open again
    expect(b.allow(1200).ok).toBe(true);
    b.reportSuccess();
    expect(b.snapshot().state).toBe("HALF_OPEN");
    b.reportSuccess();
    expect(b.snapshot().state).toBe("CLOSED");
  });
});
