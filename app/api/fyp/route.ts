import { evaluateFinalAdEligibility } from "@/lib/ads/finalAdEligibility";
import { selectFatigueSafeAds } from "@/lib/ads/selectFatigueSafeAds";
import { selectBudgetedAds } from "@/lib/ads/selectBudgetedAds";
import { selectTieredAds } from "@/lib/ads/selectTieredAds";
import { filterAdsByFrequency } from "@/lib/ads/filterAdsByFrequency";
import { injectSelectedAds } from "@/lib/ads/injectSelectedAds";
import { formatSponsoredSlots } from "@/lib/ads/formatSponsoredSlots";
import { attachFeedTimers } from "@/lib/surge/attachFeedTimers";
import { NextRequest, NextResponse } from "next/server";
import { getRemoteConfig } from "@/lib/config/getRemoteConfig";
import { getModeFromRequest } from "@/lib/mode/getModeFromRequest";
import { applyModeToFeed } from "@/lib/fyp/applyModeToFeed";
import { getInternalSponsoredPool } from "@/lib/ads/getInternalSponsoredPool";
import { injectSponsored } from "@/lib/ads/injectSponsored";

export const revalidate = 30;

type FeedItem = {
  id: string;
  kind: string;
  title: string;
  text: string;
  category?: string;
  score?: number;
  target?: { type: "portal" | "external"; value: string };
  portal?: string;
  surgeBoost?: boolean;
  media?: {
    videoUrl: string;
    posterUrl?: string;
    source: "viral" | "teaser";
    mediaId: string;
    platform?: string;
    region?: string;
    caughtAt?: string;
    velocityScore?: number;
    freshnessScore?: number;
  };
};

function attachMedia(feed: FeedItem[]): FeedItem[] {
  const viralCatchPool = [
    {
      mediaId: "viral_global_001",
      videoUrl: "/videos/test-2.mp4",
      posterUrl: "/videos/poster.png",
      source: "viral" as const,
      platform: "global-catch",
      region: "global",
      caughtAt: "2026-04-08T09:12:00.000Z",
      velocityScore: 0.95,
      freshnessScore: 0.94,
    },
    {
      mediaId: "viral_global_002",
      videoUrl: "/videos/intro.mp4",
      posterUrl: "/videos/poster.png",
      source: "viral" as const,
      platform: "global-catch",
      region: "global",
      caughtAt: "2026-04-08T09:07:00.000Z",
      velocityScore: 0.89,
      freshnessScore: 0.88,
    },
    {
      mediaId: "viral_global_003",
      videoUrl: "/stock/clip3.mp4",
      posterUrl: "/videos/poster.png",
      source: "viral" as const,
      platform: "global-catch",
      region: "global",
      caughtAt: "2026-04-08T09:03:00.000Z",
      velocityScore: 0.84,
      freshnessScore: 0.82,
    },
    {
      mediaId: "viral_global_004",
      videoUrl: "/stock/clip2.mp4",
      posterUrl: "/videos/poster.png",
      source: "viral" as const,
      platform: "global-catch",
      region: "global",
      caughtAt: "2026-04-08T08:58:00.000Z",
      velocityScore: 0.79,
      freshnessScore: 0.77,
    },
  ];

  const teaserPool = [
    {
      mediaId: "teaser_001",
      videoUrl: "/videos/intro.mp4",
      posterUrl: "/videos/poster.png",
      source: "teaser" as const,
      platform: "movie-teaser",
      region: "global",
      caughtAt: "2026-04-08T08:50:00.000Z",
      velocityScore: 0.71,
      freshnessScore: 0.84,
    },
    {
      mediaId: "teaser_002",
      videoUrl: "https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4",
      posterUrl: "/videos/poster.png",
      source: "teaser" as const,
      platform: "movie-teaser",
      region: "global",
      caughtAt: "2026-04-08T08:40:00.000Z",
      velocityScore: 0.67,
      freshnessScore: 0.80,
    },
    {
      mediaId: "teaser_003",
      videoUrl: "https://archive.org/download/TheGeneral1926/TheGeneral1926_512kb.mp4",
      posterUrl: "/videos/poster.png",
      source: "teaser" as const,
      platform: "movie-teaser",
      region: "global",
      caughtAt: "2026-04-08T08:30:00.000Z",
      velocityScore: 0.64,
      freshnessScore: 0.78,
    },
  ];

  const viralSorted = [...viralCatchPool].sort((a, b) => {
    const af = Number(a.freshnessScore || 0);
    const bf = Number(b.freshnessScore || 0);
    if (bf !== af) return bf - af;
    return String(b.caughtAt || "").localeCompare(String(a.caughtAt || ""));
  });

  const teaserSorted = [...teaserPool].sort((a, b) => {
    const af = Number(a.freshnessScore || 0);
    const bf = Number(b.freshnessScore || 0);
    if (bf !== af) return bf - af;
    return String(b.caughtAt || "").localeCompare(String(a.caughtAt || ""));
  });

  let viralIndex = 0;
  let teaserIndex = 0;
  let lastViralMediaId = "";
  let lastTeaserMediaId = "";

  return (feed || []).map((item) => {
    const category = String(item.category || item.portal || "").toUpperCase();

    if (item.kind === "sponsored") return item;

    const wantsTeaser = category === "MOVIES";

    if (wantsTeaser) {
      let media = teaserSorted[teaserIndex % teaserSorted.length];
      if (teaserSorted.length > 1 && media.mediaId == lastTeaserMediaId) {
        teaserIndex += 1;
        media = teaserSorted[teaserIndex % teaserSorted.length];
      }
      teaserIndex += 1;
      lastTeaserMediaId = media.mediaId;
      return { ...item, media };
    }

    let media = viralSorted[viralIndex % viralSorted.length];
    if (viralSorted.length > 1 && media.mediaId == lastViralMediaId) {
      viralIndex += 1;
      media = viralSorted[viralIndex % viralSorted.length];
    }
    viralIndex += 1;
    lastViralMediaId = media.mediaId;

    return { ...item, media };
  });
}



function dedupeFeedByMedia(feed: FeedItem[]): FeedItem[] {
  const seenMediaIds = new Set<string>();
  const seenVideoUrls = new Set<string>();
  const out: FeedItem[] = [];

  for (const item of feed || []) {
    const mediaId = String(item?.media?.mediaId || "").trim();
    const videoUrl = String(item?.media?.videoUrl || "").trim();

    if (!mediaId || !videoUrl) continue;
    if (seenMediaIds.has(mediaId)) continue;
    if (seenVideoUrls.has(videoUrl)) continue;

    seenMediaIds.add(mediaId);
    seenVideoUrls.add(videoUrl);
    out.push(item);
  }

  return out;
}

function getBaseFeed(): FeedItem[] {
  return [
    {
      id: "viral_organic_001",
      kind: "organic",
      title: "Viral Creator Moment",
      text: "Rapid share velocity detected.",
      category: "SOCIAL",
      score: 0.96,
    },
    {
      id: "viral_organic_002",
      kind: "organic",
      title: "Global Creator Surge",
      text: "Fast-rising creator clip entering breakout velocity.",
      category: "SOCIAL",
      score: 0.93,
    },
    {
      id: "viral_organic_003",
      kind: "organic",
      title: "Momentum Spike",
      text: "Short-form momentum accelerating across regions.",
      category: "SOCIAL",
      score: 0.90,
    },
    {
      id: "viral_organic_004",
      kind: "organic",
      title: "Audience Velocity Clip",
      text: "High replay and share activity detected.",
      category: "SOCIAL",
      score: 0.88,
    },
    {
      id: "teaser_organic_001",
      kind: "organic",
      title: "CineVerse Trailer Drop",
      text: "New trailer gaining traction.",
      category: "MOVIES",
      score: 0.86,
    },
  ];
}

export async function GET(req: NextRequest) {
  try {
    const config = getRemoteConfig();
    const mode = getModeFromRequest(req);

    const baseFeed = getBaseFeed();
    const modeFeed = applyModeToFeed(baseFeed, mode);

    const sponsoredPool = getInternalSponsoredPool();
    const sponsoredSlots =
      config.ads.enabled && config.ads.internalOnly
        ? Math.max(0, config.ads.sponsoredSlots)
        : 0;

    const injectedFeed = injectSponsored(modeFeed, sponsoredPool, sponsoredSlots);
    const timedFeed = attachFeedTimers(injectedFeed, { durationSeconds: 300, everyN: 3 });
    const rankedAds = (sponsoredPool || []).slice(0, 6).map((item: any, index: number) => ({
      adId: item?.id || `internal_${index + 1}`,
      performanceScore: Math.max(0, 1 - index * 0.1),
      portal: item?.target?.value || item?.portal || "fyp",
      seenCount: 0,
    }));
    const frequencyFilteredAds = filterAdsByFrequency({ ads: rankedAds, maxPerSession: 3 });
    const tieredAds = frequencyFilteredAds.map((ad: any) => ({
      ...ad,
      tier: ad.performanceScore >= 0.75 ? "elite"
        : ad.performanceScore >= 0.5 ? "high"
        : ad.performanceScore >= 0.25 ? "medium"
        : "low",
    }));
    const tierSelectedAds = selectTieredAds({ ads: tieredAds, maxSlots: 6 });
    const budgetedAds = tierSelectedAds.map((ad: any, index: number) => ({
      ...ad,
      spent: 0,
      budget: index < 3 ? 100 : 0,
    }));
    const budgetSelectedAds = selectBudgetedAds({ ads: budgetedAds, maxSlots: 6 });
    const fatigueSafeAds = budgetSelectedAds.map((ad: any, index: number) => ({
      ...ad,
      fatigueScore: index === 0 ? 0.2 : 0.3,
      threshold: 0.45,
    }));
    const fatigueSelectedAds = selectFatigueSafeAds({ ads: fatigueSafeAds, maxSlots: 6 });
    const eligibilityCheckedAds = fatigueSelectedAds.filter((ad: any, index: number) => {
      const eligibility = evaluateFinalAdEligibility({
        adId: ad.adId,
        spent: typeof ad.spent === "number" ? ad.spent : 0,
        budget: typeof ad.budget === "number" ? ad.budget : 0,
        fatigueScore: typeof ad.fatigueScore === "number" ? ad.fatigueScore : 0,
        threshold: typeof ad.threshold === "number" ? ad.threshold : 0.45,
        seenCount: 0,
        maxPerSession: 3,
      });
      return eligibility.eligible === true;
    });
    const selectedAds = eligibilityCheckedAds.slice(0, 3);
    const injectedFeed2 = injectSelectedAds({ feed: timedFeed, selected: selectedAds, everyN: 5 });
    const attachedFeed = formatSponsoredSlots(attachMedia(injectedFeed2));
    const videoOnlyFeed = attachedFeed.filter((item: any) => {
      if (!item || item.kind === "sponsored") return false;
      const category = String(item.category || item.portal || "").toUpperCase().trim();
      return category === "MOVIES" || category === "SOCIAL";
    });
    const finalFeed = dedupeFeedByMedia(videoOnlyFeed);

    return NextResponse.json({
      ok: true,
      source: "lumora_trinity_fyp_v1",
      mode,
      config: {
        ads: config.ads,
        surge: config.surge,
        mix: { viral: 80, teaser: 20 },
      },
      count: finalFeed.length,
      feed: finalFeed,
      ts: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "fyp_route_failed",
        detail: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 500 }
    );
  }
}
