import type { RuntimeWitnessPresence } from "./runtimePresence";

export type FypWitnessSilhouette = {
  id: string;
  label: string;
  anonymous: true;
  profileHidden: true;
};

export function syncWitnessSilhouettesInFyp(presences: RuntimeWitnessPresence[]): FypWitnessSilhouette[] {
  return presences.map((presence, index) => ({
    id: `fyp-silhouette-${presence.witnessId}`,
    label: presence.witnessName || `Witness ${index + 1}`,
    anonymous: true,
    profileHidden: true,
  }));
}
