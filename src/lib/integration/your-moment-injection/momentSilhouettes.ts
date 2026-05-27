export function buildRuntimeMomentSilhouettes(witnessIds: string[]) {
  return Array.from(new Set(witnessIds)).map((id, index) => ({
    id: `moment-silhouette-${id}`,
    label: `Witness ${index + 1}`,
    anonymous: true,
    profileHidden: true,
  }));
}
