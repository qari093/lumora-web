import { describe, expect, it } from "vitest";
import { createNativeAdCard } from "@/src/monetization/native-feed/adCard";
import { insertNativeAdIntoFeed } from "@/src/monetization/native-feed/feedInsert";
import { buildSponsoredDisclosure } from "@/src/monetization/native-feed/disclosure";
import { trackNativeAdImpression } from "@/src/monetization/native-feed/impression";
import { validateNativeAdUx } from "@/src/monetization/native-feed/validate";

describe("Monetization Pack06 — Native Feed Ads", () => {
  it("creates native ad card", () => {
    const ad = createNativeAdCard({
      adId: "ad1",
      campaignId: "camp1",
      sponsorName: "Lumora Partner",
      title: "Calm product",
      mediaUrl: "/ad.mp4",
      clickUrl: "/ad-click",
    });

    expect(ad.disclosure).toBe("Sponsored");
    expect(ad.format).toBe("native_feed");
    expect(validateNativeAdUx(ad).ok).toBe(true);
  });

  it("inserts native ad into feed", () => {
    const ad = createNativeAdCard({
      adId: "ad1",
      campaignId: "camp1",
      sponsorName: "Sponsor",
      title: "Ad",
      mediaUrl: "/ad.mp4",
      clickUrl: "/click",
    });

    const feed = insertNativeAdIntoFeed({
      feed: [{ id: "v1" }, { id: "v2" }],
      ad,
      afterIndex: 0,
    });

    expect(feed).toHaveLength(3);
    expect("type" in feed[1] ? feed[1].type : undefined).toBe("ad");
  });

  it("builds transparent sponsored disclosure", () => {
    const disclosure = buildSponsoredDisclosure({ sponsorName: "Sponsor" });

    expect(disclosure.label).toBe("Sponsored");
    expect(disclosure.visible).toBe(true);
    expect(disclosure.userTransparent).toBe(true);
  });

  it("tracks native ad impression", () => {
    const impression = trackNativeAdImpression({
      adId: "ad1",
      campaignId: "camp1",
      state: "green",
      position: 6,
      shownAt: "2026-05-05T00:00:00.000Z",
    });

    expect(impression.shownAt).toBe("2026-05-05T00:00:00.000Z");
    expect(impression.position).toBe(6);
  });
});
