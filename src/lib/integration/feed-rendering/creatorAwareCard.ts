export function buildCreatorAwareFypCard(item: any) {
  return {
    ...item,
    creatorAware: Boolean(item.creator?.id),
    creatorLabel: item.creator?.name || "Creator",
  };
}
