import type {
  MonetizationDecision,
  MonetizationSignal
} from "../types";

import { evaluateMonetization } from "./monetizationPolicy";

export function runMonetizationRuntime(
  signal: MonetizationSignal
): MonetizationDecision {
  return evaluateMonetization(signal);
}
