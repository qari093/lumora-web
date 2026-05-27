import { NativeAdCard } from "./adCard";

export function insertNativeAdIntoFeed<T>(input: {
  feed: T[];
  ad: NativeAdCard;
  afterIndex: number;
}) {
  const index = Math.max(0, Math.min(input.afterIndex + 1, input.feed.length));
  return [
    ...input.feed.slice(0, index),
    { type: "ad" as const, item: input.ad },
    ...input.feed.slice(index),
  ];
}
