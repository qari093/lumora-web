import { UserState } from "@/src/monetization/config/stateModel";

export type AdType = "native_feed" | "exit_interaction" | "reward";

export type EligibilityInput = {
  state: UserState;
  notNowActive?: boolean;
};

export function isAdEligible(input: EligibilityInput) {
  if (input.notNowActive) return false;
  return input.state !== "red";
}

export function allowedAdTypes(state: UserState): AdType[] {
  if (state === "green") return ["native_feed", "exit_interaction", "reward"];
  if (state === "yellow") return ["native_feed"];
  return [];
}
