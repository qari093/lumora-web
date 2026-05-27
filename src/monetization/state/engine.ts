import { classifyAdvancedState, ExtendedStateInput } from "./classifier";
import { smoothSession, SessionSnapshot } from "./memory";
import { resolveTransition } from "./transitions";
import { UserState } from "@/src/monetization/config/stateModel";

export type StateEngineInput = ExtendedStateInput & {
  history: SessionSnapshot[];
  previousState: UserState;
};

export function computeState(input: StateEngineInput): UserState {
  const smoothed = smoothSession(input.history, {
    skipRate: input.skipRate,
    holdRate: input.holdRate,
    emotionalDrift: input.emotionalDrift,
  });

  const next = classifyAdvancedState({
    ...input,
    ...smoothed,
  });

  return resolveTransition(input.previousState, next);
}
