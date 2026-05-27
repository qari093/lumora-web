import { NativeAdCard } from "./adCard";

export function validateNativeAdUx(card: NativeAdCard) {
  return {
    ok:
      card.format === "native_feed" &&
      card.disclosure === "Sponsored" &&
      Boolean(card.sponsorName) &&
      Boolean(card.mediaUrl) &&
      Boolean(card.clickUrl),
  };
}
