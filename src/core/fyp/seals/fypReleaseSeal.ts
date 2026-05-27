export type FypReleaseSeal = {
  sealId: string;
  name: string;
  complete: boolean;
  productionCandidate: boolean;
};

export function createFypReleaseSeal(input: {
  complete: boolean;
  testsPassed: boolean;
}): FypReleaseSeal {
  return {
    sealId: "lumora_fyp_release_seal",
    name: "Lumora FYP Emotional Spectrum Engine",
    complete: input.complete && input.testsPassed,
    productionCandidate: input.complete && input.testsPassed
  };
}
