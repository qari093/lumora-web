export type NativeAdImpression = {
  adId: string;
  campaignId: string;
  shownAt: string;
  state: "green" | "yellow";
  position: number;
};

export function trackNativeAdImpression(input: Omit<NativeAdImpression, "shownAt"> & { shownAt?: string }) {
  return {
    ...input,
    shownAt: input.shownAt || new Date().toISOString(),
  };
}
