import type {
  RecoveryDecision,
  RecoveryEvent
} from "../types";

import {
  validateRecoveryEvent
} from "../contracts/recoveryContract";

export function decideRecoveryAction(
  event: RecoveryEvent
): RecoveryDecision {
  if (!validateRecoveryEvent(event)) {
    throw new Error("invalid_recovery_event");
  }

  if (event.severity === "fatal") {
    return {
      id: event.id,
      action: "halt",
      reason: "fatal_error"
    };
  }

  if (event.retryable) {
    return {
      id: event.id,
      action: "retry",
      reason: "retryable_error"
    };
  }

  return {
    id: event.id,
    action: "fallback",
    reason: "safe_fallback"
  };
}
