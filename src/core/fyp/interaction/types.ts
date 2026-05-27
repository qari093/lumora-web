export type InteractionType =
  | "tap"
  | "hold"
  | "swipe"
  | "reaction"
  | "share";

export interface InteractionEvent {
  id: string;
  itemId: string;
  type: InteractionType;
  strength: number;
}

export interface InteractionResult {
  itemId: string;
  score: number;
  intent: string;
}
