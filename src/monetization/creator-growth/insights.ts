export function buildCreatorInsight(input: {
  creatorId: string;
  presenceDepth: number;
  resonance: number;
  drift: number;
}) {
  const strongest =
    input.resonance >= input.presenceDepth
      ? "rewatch_resonance"
      : "presence_depth";

  return {
    creatorId: input.creatorId,
    strongest,
    health:
      input.drift > 0.5
        ? "needs_adjustment"
        : "healthy",
  };
}
