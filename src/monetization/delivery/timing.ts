export function chooseAdTiming(input: {
  userState: "green" | "yellow" | "red";
  sessionDepth: number;
  completionJustHappened: boolean;
}) {
  if (input.userState === "red") return { slot: "none" as const };
  if (input.userState === "green" && input.completionJustHappened) return { slot: "post_completion" as const };
  if (input.sessionDepth >= 6) return { slot: "native_feed" as const };
  return { slot: "none" as const };
}
