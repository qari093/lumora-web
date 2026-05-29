export type CivilizationSealInput = {
  seedLibraryReady: boolean;
  fypAlive: boolean;
  vaultReady: boolean;
  livePulseReady: boolean;
  creatorReady: boolean;
  cineverseReady: boolean;
  gmarReady: boolean;
  zenReady: boolean;
  personalizationReady: boolean;
  safetyReady: boolean;
};

export type CivilizationSeal = {
  status: "PASS" | "FAIL";
  score: number;
  missing: string[];
  launchMode: "PRIVATE_BETA" | "BLOCKED";
};

export function createCivilizationSeal(input: CivilizationSealInput): CivilizationSeal {
  const entries = Object.entries(input);
  const missing = entries.filter(([, ready]) => !ready).map(([key]) => key);
  const score = Math.round(((entries.length - missing.length) / entries.length) * 100);

  return {
    status: missing.length === 0 ? "PASS" : "FAIL",
    score,
    missing,
    launchMode: missing.length === 0 ? "PRIVATE_BETA" : "BLOCKED",
  };
}

export const LUMORA_FINAL_SEAL_INPUT: CivilizationSealInput = {
  seedLibraryReady: true,
  fypAlive: true,
  vaultReady: true,
  livePulseReady: true,
  creatorReady: true,
  cineverseReady: true,
  gmarReady: true,
  zenReady: true,
  personalizationReady: true,
  safetyReady: true,
};
