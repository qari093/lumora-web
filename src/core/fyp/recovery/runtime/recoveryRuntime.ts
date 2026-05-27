import type {
  RecoveryDecision,
  RecoveryEvent
} from "../types";

import {
  decideRecoveryAction
} from "./recoveryPolicy";

export function runRecoveryRuntime(
  events: RecoveryEvent[]
): RecoveryDecision[] {
  return events.map(decideRecoveryAction);
}
