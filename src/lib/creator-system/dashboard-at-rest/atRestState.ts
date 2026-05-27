export type CreatorAtRestState = {
  creatorId: string;
  state: "at-rest";
  lastWitnessedAt?: string;
  nextCircleIso?: string;
  calmMode: true;
};

export function createAtRestDashboardState(input: {
  creatorId: string;
  lastWitnessedAt?: string;
  nextCircleIso?: string;
}): CreatorAtRestState {
  return {
    creatorId: input.creatorId,
    state: "at-rest",
    lastWitnessedAt: input.lastWitnessedAt,
    nextCircleIso: input.nextCircleIso,
    calmMode: true,
  };
}
