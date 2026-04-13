type FeedItem = {
  kind?: string;
  adId?: string;
};

export function getFypFeedSummary(feed: FeedItem[]) {
  const items = Array.isArray(feed) ? feed : [];

  const total = items.length;
  const sponsored = items.filter((item) => item.kind === "sponsored").length;
  const content = items.filter((item) => item.kind !== "sponsored").length;
  const adsWithId = items.filter((item) => item.kind === "sponsored" && typeof item.adId === "string" && item.adId.length > 0).length;

  return {
    total,
    sponsored,
    content,
    adsWithId,
    healthy: total > 0 && sponsored >= 1 && content >= 1,
  };
}
