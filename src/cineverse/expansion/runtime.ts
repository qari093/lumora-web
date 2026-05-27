export const expansionSystems = [
  "cinerights",
  "festival-partnerships",
  "university-program",
  "emotional-genome-api",
  "global-expansion",
] as const;

export function launchExpansionLayer() {
  return {
    expansion: "active",
    eternalMode: true,
  };
}

export function supportsGlobalGrowth() {
  return true;
}
