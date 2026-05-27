export type PersonalizationSignalType =
  | "watch"
  | "like"
  | "share"
  | "skip"
  | "dwell";

export type PersonalizationSignal = {
  userId: string;
  itemId: string;
  type: PersonalizationSignalType;
  weight: number;
  ts: number;
};

export type PersonalizationProfile = {
  userId: string;
  affinity: Record<string, number>;
  updatedAt: number;
};

export type PersonalizationDecision = {
  itemId: string;
  baseScore: number;
  personalizedScore: number;
  reason: string;
};
