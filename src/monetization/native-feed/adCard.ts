export type NativeAdCard = {
  adId: string;
  campaignId: string;
  sponsorName: string;
  title: string;
  mediaUrl: string;
  clickUrl: string;
  disclosure: "Sponsored";
  format: "native_feed";
};

export function createNativeAdCard(input: Omit<NativeAdCard, "disclosure" | "format">): NativeAdCard {
  return {
    ...input,
    disclosure: "Sponsored",
    format: "native_feed",
  };
}
