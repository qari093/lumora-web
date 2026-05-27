import { UserState } from "@/src/monetization/config/stateModel";

export type ExtendedStateInput = {
  skipRate: number;
  holdRate: number;
  sessionDepth: number;
  rewatchRate: number;
  emotionalDrift: number;
};

export function classifyAdvancedState(input: ExtendedStateInput): UserState {
  if (input.skipRate > 0.65 || input.emotionalDrift > 0.7) return "red";
  if (
    input.holdRate > 0.55 &&
    input.sessionDepth > 3 &&
    input.rewatchRate > 0.1 &&
    input.emotionalDrift < 0.4
  ) return "green";
  return "yellow";
}
