export function triggerAfterWitnessState(input: {
  creatorId: string;
  circleId: string;
  circleCompleted: boolean;
}) {
  return {
    creatorId: input.creatorId,
    circleId: input.circleId,
    triggered: input.circleCompleted,
    state: input.circleCompleted ? "after-witness" : "waiting",
  };
}
