export type FypFinalReleaseStatus = {
  name: string;
  totalPacks: number;
  completedPacks: number;
  ready: boolean;
  productionLocked: boolean;
  publicBetaCandidate: boolean;
};

export function createFypFinalReleaseStatus(input: {
  completedPacks: number;
}): FypFinalReleaseStatus {
  const ready = input.completedPacks === 32;

  return {
    name: "Lumora FYP Emotional Spectrum Engine",
    totalPacks: 32,
    completedPacks: input.completedPacks,
    ready,
    productionLocked: ready,
    publicBetaCandidate: ready
  };
}

export function assertFypFinalReleaseStatus(
  status: FypFinalReleaseStatus
): boolean {
  return (
    status.totalPacks === 32 &&
    status.completedPacks === 32 &&
    status.ready &&
    status.productionLocked &&
    status.publicBetaCandidate
  );
}
