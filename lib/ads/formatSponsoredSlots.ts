type FeedItem = {
  id: string;
  kind: string;
  route?: string;
  target?: { type: "portal" | "external"; value: string };
  [key: string]: any;
};

export function formatSponsoredSlots(feed: FeedItem[]): FeedItem[] {
  let sponsoredIndex = 0;

  return (feed || []).map((item, index) => {
    if (item.kind !== "sponsored") return item;

    sponsoredIndex += 1;

    const targetRoute =
      item.route ||
      (item.target?.type === "portal" && item.target?.value
        ? `/${item.target.value}`
        : "/");

    return {
      ...item,
      slotType: "internal-sponsored",
      slotIndex: sponsoredIndex,
      feedIndex: index,
      targetRoute,
      clickUrl: `/api/ads/click?type=${encodeURIComponent(item.target?.type || "portal")}&value=${encodeURIComponent(item.target?.value || "")}`,
    };
  });
}
