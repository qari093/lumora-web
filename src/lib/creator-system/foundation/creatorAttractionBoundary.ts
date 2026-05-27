export const CREATOR_ATTRACTION_BOUNDARY = {
  module: "creator-attraction",
  purpose: "Bring creators into Lumora through meaningful witness-based feedback, not fake metrics.",
  owns: [
    "first-breath-onboarding",
    "phantom-circle",
    "reaction-circle-entry",
    "creator-retention-loop",
    "share-as-memory",
  ],
  forbidden: [
    "fake-followers",
    "fake-views",
    "public-vanity-ranking",
    "algorithmic-emotion-labeling",
  ],
} as const;

export function isCreatorAttractionFeature(feature: string): boolean {
  return CREATOR_ATTRACTION_BOUNDARY.owns.includes(feature as any);
}
