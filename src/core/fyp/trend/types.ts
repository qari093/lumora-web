export type TrendDirection =
  | "up"
  | "stable"
  | "down";

export interface TrendSignal {
  id: string;
  velocity: number;
  engagement: number;
}

export interface TrendResult {
  id: string;
  score: number;
  direction: TrendDirection;
}
