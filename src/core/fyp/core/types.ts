export type AtmosphereMode =
  | "comfort"
  | "drift"
  | "chaos"
  | "deep"
  | "energy"
  | "focus"
  | "wonder";

export interface FeedItem {
  id: string;
  creatorId: string;
  mode: AtmosphereMode;
  intensity: number;
  replayWeight: number;
  novelty: number;
  createdAt: number;
}

export interface FeedSession {
  sessionId: string;
  userId: string;
  currentMode: AtmosphereMode;
  emotionalLoad: number;
  continuityScore: number;
}
