export function validateWitnessContinuity(input: {
  traces: { creatorId: string; witnessId: string; stored?: boolean }[];
  creatorId: string;
  witnessId: string;
}) {
  const count = input.traces.filter(
    (trace) =>
      trace.creatorId === input.creatorId &&
      trace.witnessId === input.witnessId &&
      trace.stored === true,
  ).length;

  return {
    ok: count > 0,
    repeatCount: count,
    reason: count > 0 ? "witness_continuity_valid" : "witness_continuity_missing",
  };
}
