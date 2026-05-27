import { describe, expect, it } from "vitest";

import {
  validateRecoveryEvent
} from "@/src/core/fyp/recovery/contracts/recoveryContract";

import {
  decideRecoveryAction
} from "@/src/core/fyp/recovery/runtime/recoveryPolicy";

import {
  runRecoveryRuntime
} from "@/src/core/fyp/recovery/runtime/recoveryRuntime";

const event = {
  id: "recovery_001",
  code: "feed_timeout",
  severity: "soft" as const,
  retryable: true
};

describe("Lumora FYP Error Recovery Runtime Activation", () => {
  it("validates recovery event", () => {
    expect(validateRecoveryEvent(event)).toBe(true);
  });

  it("chooses retry for retryable error", () => {
    const decision = decideRecoveryAction(event);

    expect(decision.action).toBe("retry");
    expect(decision.reason).toBe("retryable_error");
  });

  it("chooses fallback for non-retryable hard error", () => {
    const decision = decideRecoveryAction({
      ...event,
      severity: "hard",
      retryable: false
    });

    expect(decision.action).toBe("fallback");
  });

  it("halts on fatal error", () => {
    const decision = decideRecoveryAction({
      ...event,
      severity: "fatal",
      retryable: true
    });

    expect(decision.action).toBe("halt");
  });

  it("runs recovery runtime", () => {
    const decisions = runRecoveryRuntime([event]);

    expect(decisions).toHaveLength(1);
    expect(decisions[0].id).toBe("recovery_001");
  });
});
