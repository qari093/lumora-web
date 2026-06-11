import {
  buildRealFeedCards,
  type RealFypFeedCard
} from "@/src/core/fyp/runtime-adapter/realFeedAdapter";

export type FypRuntimeUiState = {
  source: "real_feed_adapter";
  cards: RealFypFeedCard[];
  activeCard: RealFypFeedCard | null;
  ready: boolean;
  empty: boolean;
};

export function buildFypRuntimeUiState(): FypRuntimeUiState {
  const cards = buildRealFeedCards();

  return {
    source: "real_feed_adapter",
    cards,
    activeCard: cards[0] ?? null,
    ready: cards.length > 0,
    empty: cards.length === 0
  };
}

export function validateFypRuntimeUiWiring(): boolean {
  const state = buildFypRuntimeUiState();

  return (
    state.source === "real_feed_adapter" &&
    state.ready === true &&
    state.empty === false &&
    state.cards.length > 0 &&
    state.activeCard !== null &&
    state.cards.every((card) =>
      Boolean(card.id) &&
      Boolean(card.playbackUrl) &&
      card.autoplayEligible === true
    )
  );
}
