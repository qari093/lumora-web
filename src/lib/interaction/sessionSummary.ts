export type InteractionEventType =
  | "like"
  | "share"
  | "save"
  | "skip"
  | "watch";

export type InteractionEvent = {
  type: InteractionEventType;
};

export type InteractionSummary = Record<InteractionEventType, number>;

export function summarize(
  events: readonly InteractionEvent[],
): InteractionSummary {
  const out: InteractionSummary = {
    like: 0,
    share: 0,
    save: 0,
    skip: 0,
    watch: 0,
  };

  for (const event of events) {
    out[event.type] += 1;
  }

  return out;
}
