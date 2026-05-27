export interface WatchProgressEvent {
  itemId: string;
  watchedMs: number;
  durationMs: number;
}

export interface WatchProgressResult {
  itemId: string;
  percent: number;
  completed: boolean;
  milestone: string;
}
