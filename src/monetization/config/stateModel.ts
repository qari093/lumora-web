export type UserState = "green" | "yellow" | "red";

export type StateInput = {
  skipRate: number;
  holdRate: number;
  sessionDepth: number;
};

export function classifyState(input: StateInput): UserState {
  if (input.skipRate > 0.6) return "red";
  if (input.holdRate > 0.5 && input.sessionDepth > 3) return "green";
  return "yellow";
}
