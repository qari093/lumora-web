export type LearningEvent = {
  type: string;
  content_id?: string;
  ts: number;
  dwell_ms?: number;
  scroll_depth?: number;
  meta?: Record<string, any>;
};
