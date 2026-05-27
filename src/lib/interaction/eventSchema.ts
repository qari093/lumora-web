export type InteractionEvent = {
  type: "like" | "share" | "save" | "skip" | "watch";
  content_id: string;
  ts: number;
  meta?: Record<string, any>;
};
