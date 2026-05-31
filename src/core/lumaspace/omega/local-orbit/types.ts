export type LocalVisibility = "off" | "city" | "nearby";

export type LocalOrbitConsent = {
  citizenId: string;
  visibility: LocalVisibility;
  bridgeMatching: boolean;
  expiresAt: number;
};

export type LocalSignal = {
  id: string;
  citizenId: string;
  cityHash: string;
  interestTags: string[];
  trustScore: number;
  distanceBand: "same_city" | "nearby_area";
  identityBlurred: true;
};

export type LocalMatch = {
  id: string;
  citizenA: string;
  citizenB: string;
  sharedTags: string[];
  safe: boolean;
};
