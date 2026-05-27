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
};

export type DiscoveryResult = {
  ok: true;
  lane: DiscoveryLane;
  items: DiscoveryItem[];
};
