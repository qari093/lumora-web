export type DiversityLane =
  | "movies"
  | "music"
  | "gaming"
  | "sports"
  | "culture"
  | "news";

export interface DiversityFeedItem {
  id: string;
  lane: DiversityLane;
  score: number;
}

export interface DiversityResult {
  lane: DiversityLane;
  count: number;
  score: number;
}
