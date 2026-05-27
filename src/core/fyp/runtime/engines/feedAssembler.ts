import type {
  RuntimeFeedItem
} from "../types";

export function assembleRuntimeFeed(input: {
  primary: RuntimeFeedItem[];
  exploration: RuntimeFeedItem[];
  anomalies: RuntimeFeedItem[];
}): RuntimeFeedItem[] {
  return [
    ...input.primary.slice(0, 5),
    ...input.exploration.slice(0, 2),
    ...input.anomalies.slice(0, 1)
  ];
}
