export type AdImpressionEvent = {
  id: string;
  adId: string;
  portal: string;
  slotIndex: number;
  createdAt: number;
};

export function trackAdImpression(input: {
  adId: string;
  portal: string;
  slotIndex?: number;
}): AdImpressionEvent {
  return {
    id: `imp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    adId: String(input.adId || ""),
    portal: String(input.portal || ""),
    slotIndex: Math.max(0, Math.floor(input.slotIndex ?? 0)),
    createdAt: Date.now(),
  };
}
