export function createMarketplacePlaceholder(input: {
  marketId: string;
  type: "attention_queue" | "creator_bond" | "sponsor_bid";
}) {
  return {
    ...input,
    active: false,
    phase: "future_acp",
  };
}
