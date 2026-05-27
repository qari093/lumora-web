import { UserState } from "@/src/monetization/config/stateModel";

export function canTransition(from: UserState, to: UserState): boolean {
  if (from === "red" && to === "green") return false;
  return true;
}

export function resolveTransition(from: UserState, next: UserState): UserState {
  if (!canTransition(from, next)) return "yellow";
  return next;
}
