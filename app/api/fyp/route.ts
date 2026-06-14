import { evaluateFinalAdEligibility } from "@/lib/ads/finalAdEligibility";
import { selectFatigueSafeAds } from "@/lib/ads/selectFatigueSafeAds";
import { selectBudgetedAds } from "@/lib/ads/selectBudgetedAds";
import { selectTieredAds } from "@/lib/ads/selectTieredAds";
import { filterAdsByFrequency } from "@/lib/ads/filterAdsByFrequency";
import { injectSelectedAds } from "@/lib/ads/injectSelectedAds";
import { formatSponsoredSlots } from "@/lib/ads/formatSponsoredSlots";
import { attachFeedTimers } from "@/lib/surge/attachFeedTimers";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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

function getDeploySafeMediaPool() {
  const publicDir = path.join(process.cwd(), "public", "videos");
  const allowed = new Set([".mp4", ".webm", ".mov"]);

  let files: string[] = [];
  try {
    files = fs
      .readdirSync(publicDir)
      .filter((name) => allowed.has(path.extname(name).toLowerCase()))
      .filter((name) => !name.toLowerCase().includes("poster"))
      .sort();
  } catch {
    files = [];
  }

  const preferred = files.filter((name) =>
    /^(gen-|test-|intro|lumora|teaser|workout)/i.test(name)
  );

  return (preferred.length ? preferred : files).map((name, index) => ({
    mediaId: `public_video_${index + 1}_${name.replace(/[^a-z0-9]/gi, "_")}`,
    videoUrl: `/videos/${name}`,
    posterUrl: "/videos/poster.png",
    source: "viral" as const,
    platform: "lumora-public-video",
    region: "global",
    caughtAt: new Date(Date.now() - index * 60000).toISOString(),
    velocityScore: Math.max(0.55, 0.98 - index * 0.025),
    freshnessScore: Math.max(0.55, 0.98 - index * 0.02),
  }));
}

function attachMedia(feed: FeedItem[]): FeedItem[] {
  const mediaPool = getDeploySafeMediaPool();

  if (!mediaPool.length) {
    return feed;
  }

  let index = 0;

  return (feed || []).map((item) => {
    if (item.kind === "sponsored") return item;

    const media = mediaPool[index % mediaPool.length];
    index += 1;

    return {
      ...item,
      media: {
        ...media,
        source:
          String(item.category || item.portal || "").toUpperCase() === "MOVIES"
            ? "teaser"
            : "viral",
      },
    };
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
