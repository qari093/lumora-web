export type PrivacyGuardResult = {
  rawImageStored: false;
  rawVideoStored: false;
  allowedArtifacts: string[];
};

export function getReactionPrivacyGuard(): PrivacyGuardResult {
  return {
    rawImageStored: false,
    rawVideoStored: false,
    allowedArtifacts: ["silhouette", "motion_vector", "aggregate_intensity"],
  };
}
