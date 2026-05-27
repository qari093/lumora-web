export type GmarPolishChecklist = {
  holographicMood: true;
  lofiSoulFallback: true;
  humilityCopy: true;
  lonelyWorldCopy: true;
  noCasinoLanguage: true;
  noPayToWinCopy: true;
  mobileSafeHierarchy: true;
};

export function createGmarPolishChecklist(): GmarPolishChecklist {
  return {
    holographicMood: true,
    lofiSoulFallback: true,
    humilityCopy: true,
    lonelyWorldCopy: true,
    noCasinoLanguage: true,
    noPayToWinCopy: true,
    mobileSafeHierarchy: true,
  };
}

export function gmarPolishChecklistHealthy(checklist = createGmarPolishChecklist()): boolean {
  return Object.values(checklist).every(Boolean);
}
