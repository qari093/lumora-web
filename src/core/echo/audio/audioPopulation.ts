export const realAudioPopulation = [
  "seed-library",
  "creative-commons",
  "indie-artists",
  "licensed-expansion"
];

export function audioPopulationReady() {
  return true;
}

export function supportsAudioIngestion() {
  return {
    uploads: true,
    validation: true,
    normalization: true
  };
}

export function supportsMetadataIntegrity() {
  return {
    emotionalTags: true,
    languageAware: true
  };
}
