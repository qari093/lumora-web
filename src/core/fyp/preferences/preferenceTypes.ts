export type FypPreferenceSignal =
  | "more_like_this"
  | "less_like_this"
  | "like"
  | "dislike";

export interface FypPreferenceEvent {
  userId: string;
  assetId: string;
  lane: string;
  signal: FypPreferenceSignal;
  ts: number;
}

export interface FypPreferenceProfile {
  userId: string;
  laneWeights: Record<string, number>;
  updatedAt: number;
}
