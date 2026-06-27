export type FypInteractionType =
  | "like"
  | "dislike"
  | "share"
  | "save"
  | "send_to_space"
  | "more_like_this"
  | "less_like_this"
  | "deep_dive";

export interface FypInteractionEvent {
  type: FypInteractionType;
  assetId: string;
  lane: string;
  ts: number;
}

export interface FypInteractionState {
  likes: number;
  dislikes: number;
  shares: number;
  saves: number;
  sendsToSpace: number;
  deepDives: number;
}
