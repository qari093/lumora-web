export type PresenceSilhouette = {
  id: string;
  anonymous: true;
  profileHidden: true;
  label: string;
};

export function buildPresenceSilhouettes(witnessIds: string[]): PresenceSilhouette[] {
  return Array.from(new Set(witnessIds)).map((id, index) => ({
    id: `silhouette-${id}`,
    anonymous: true,
    profileHidden: true,
    label: `Witness ${index + 1}`,
  }));
}
