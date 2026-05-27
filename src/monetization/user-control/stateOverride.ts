import { UserState } from "@/src/monetization/config/stateModel";
import { isNotNowActive } from "./overrideTimer";

export function applyUserControlOverride(input: {
  computedState: UserState;
  nowMs: number;
  activeUntilMs?: number;
}): UserState {
  return isNotNowActive({
    nowMs: input.nowMs,
    activeUntilMs: input.activeUntilMs,
  })
    ? "red"
    : input.computedState;
}
