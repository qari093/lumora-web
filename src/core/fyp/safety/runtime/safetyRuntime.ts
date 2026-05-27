import type {
  SafetyDecision,
  SafetyInput
} from "../types";

import { evaluateSafetyPolicy } from "./policyRules";

export class FypSafetyRuntime {
  decide(
    input: SafetyInput
  ): SafetyDecision {
    return evaluateSafetyPolicy(input);
  }

  canPublish(
    input: SafetyInput
  ): boolean {
    return this.decide(input).allowed;
  }
}

export function createFypSafetyRuntime() {
  return new FypSafetyRuntime();
}
