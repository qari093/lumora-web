import type { FeedItem } from "../core/types";

export type DiscoveryLane =
  | "viral"
  | "fresh"
  | "local"
  | "calm";

export type DiscoveryItem = {
  id: string;
  title: string;
  lane: DiscoveryLane;
  score: number;
  createdAt: number;
  mode?: string;
  intensity?: number;
  novelty?: number;
};

export type DiscoveryResult = {
  ok: true;
  lane?: DiscoveryLane;
  requestId?: string;
  userId?: string;
  targetMode?: string;
  chaosAllowed?: boolean;
  maxIntensity?: number;
  noveltyBudget?: number;
  items: DiscoveryItem[];
};

export type DiscoveryEdgeRequest = {
  userId: string;
  currentMode: string;
  currentIntensity: number;
  noveltyTolerance: number;
  intent: string;
};
export type DiscoveryEdgeResult = {
  ok?: true;
  requestId: string;
  userId: string;
  targetMode: string;
  chaosAllowed: boolean;
  maxIntensity: number;
  noveltyBudget: number;
  items: FeedItem[];
};
