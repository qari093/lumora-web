import type {
  MonetizationDecision,
  MonetizationSignal
} from "../types";

import { validateMonetizationSignal } from "../contracts/monetizationContract";

export function evaluateMonetization(
  signal: MonetizationSignal
): MonetizationDecision {
  if (!validateMonetizationSignal(signal)) {
    throw new Error("invalid_monetization_signal");
  }

  if (!signal.eligible || signal.mode === "disabled") {
    return {
      allowed: false,
      mode: "disabled",
      estimatedValue: 0,
      reason: "not_eligible"
    };
  }

  return {
    allowed: true,
    mode: signal.mode,
    estimatedValue: signal.value,
    reason: "eligible"
  };
}
