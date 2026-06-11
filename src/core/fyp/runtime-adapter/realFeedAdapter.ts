import {
  buildFypRuntimeApiFeed,
  type FypRuntimeApiFeedItem
} from "@/src/core/fyp/runtime-api/feedApiBridge";

export type RealFypFeedCard = {
  id: string;
  title: string;
  creator: string;
  playbackUrl: string;
  sourceId: string;
  lane: "native_video" | "official_embed";
  traceLane: string;
  rankingSeed: number;
  autoplayEligible: boolean;
};

export function adaptRuntimeItemToFeedCard(
  item: FypRuntimeApiFeedItem
): RealFypFeedCard {
  return {
    id: item.id,
    title: item.title,
    creator: item.creator,
    playbackUrl: item.playbackUrl,
    sourceId: item.sourceId,
    lane: item.deliveryLane,
    traceLane: item.traceLane,
    rankingSeed: item.rankingSeed,
    autoplayEligible: true
  };
}

export function buildRealFeedCards(): RealFypFeedCard[] {
  const runtime = buildFypRuntimeApiFeed();

  return runtime.items.map(adaptRuntimeItemToFeedCard);
}

export function validateRealFeedAdapter(): boolean {
  const cards = buildRealFeedCards();

  return (
    cards.length > 0 &&
    cards.every(card =>
      Boolean(card.id) &&
      Boolean(card.title) &&
      Boolean(card.playbackUrl) &&
      card.autoplayEligible === true
    )
  );
}
