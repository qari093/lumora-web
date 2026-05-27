export type SocialSignalType =
  | "share"
  | "comment"
  | "save"
  | "reaction";

export interface SocialSignal {
  id: string;
  type: SocialSignalType;
  strength: number;
}

export interface SocialSignalResult {
  id: string;
  viralScore: number;
  amplified: boolean;
}
