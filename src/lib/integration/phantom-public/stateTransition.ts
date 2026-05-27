export type PhantomPublicState =
  | "phantom-circle"
  | "public-circle-unlocked"
  | "public-circle-pending";

export function syncPhantomToPublicState(input: {
  currentState: PhantomPublicState;
  unlocked: boolean;
}): PhantomPublicState {
  if (input.currentState === "phantom-circle" && input.unlocked) {
    return "public-circle-unlocked";
  }

  if (input.currentState === "phantom-circle" && !input.unlocked) {
    return "public-circle-pending";
  }

  return input.currentState;
}
