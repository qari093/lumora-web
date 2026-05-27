import { UserState } from "@/src/monetization/config/stateModel";

export function isValidState(s: string): s is UserState {
  return s === "green" || s === "yellow" || s === "red";
}
