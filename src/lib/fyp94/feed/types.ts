export type Fyp94FeedItem = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  playbackUrl: string;
  posterUrl: string;
  thrillScore: number;
  source: string;
  layer?: "supply" | "trend" | "narrative" | "fomo" | "wave" | "vault";
};

export type Fyp94FeedResponse = {
  ok: true;
  source: "fyp94";
  version: "9.4";
  items: Fyp94FeedItem[];
  generatedAt: string;
};
