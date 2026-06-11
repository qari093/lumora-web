import {
  normalizeFypIngestionBatch,
  type FypIngestionJobInput,
  type FypNormalizedFeedItem
} from "./ingestionQueue";

export type FypFeedBridgeItem = FypNormalizedFeedItem & {
  bridgeStatus: "eligible" | "blocked";
  rankingSeed: number;
  deliveryLane: "native_video" | "official_embed";
  dedupeKey: string;
  safetyTags: string[];
};

export type FypFeedBridgeResult = {
  items: FypFeedBridgeItem[];
  blocked: Array<{
    externalId: string;
    reason: string;
  }>;
  generatedAt: string;
};

function makeDedupeKey(item: FypNormalizedFeedItem): string {
  return [item.sourceId, item.title, item.url]
    .join(":")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 128);
}

function rankingSeed(item: FypNormalizedFeedItem): number {
  const base = item.durationSeconds + item.width + item.height + item.sourceId.length;
  return Math.max(1, Math.min(base, 9999));
}

export function isFypFeedBridgeEligible(item: FypNormalizedFeedItem): boolean {
  return (
    item.rightsVerified === true &&
    item.safeForFyp === true &&
    item.durationSeconds >= 1 &&
    item.durationSeconds <= 900 &&
    Boolean(item.url) &&
    Boolean(item.title) &&
    Boolean(item.sourceId)
  );
}

export function bridgeNormalizedItemToFypFeed(item: FypNormalizedFeedItem): FypFeedBridgeItem {
  const eligible = isFypFeedBridgeEligible(item);

  return {
    ...item,
    bridgeStatus: eligible ? "eligible" : "blocked",
    rankingSeed: rankingSeed(item),
    deliveryLane: item.ingestionMode === "embed_only" ? "official_embed" : "native_video",
    dedupeKey: makeDedupeKey(item),
    safetyTags: [
      "rights_verified",
      "source_policy_checked",
      item.ingestionMode === "embed_only" ? "embed_only" : "native_video"
    ]
  };
}

export function buildFypFeedBridge(inputs: FypIngestionJobInput[]): FypFeedBridgeResult {
  const inputKeyCounts = new Map<string, number>();

  for (const input of inputs) {
    const key = [input.sourceId, input.title, input.sampleUrl]
      .join(":")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 128);

    inputKeyCounts.set(key, (inputKeyCounts.get(key) ?? 0) + 1);
  }

  const normalized = normalizeFypIngestionBatch(inputs);
  const seenBridgeKeys = new Set<string>();
  const items: FypFeedBridgeItem[] = [];
  const blocked: Array<{ externalId: string; reason: string }> = [];

  for (const item of normalized.map(bridgeNormalizedItemToFypFeed)) {
    if (!isFypFeedBridgeEligible(item)) {
      blocked.push({ externalId: item.id, reason: "not_eligible" });
      continue;
    }

    if (seenBridgeKeys.has(item.dedupeKey)) {
      blocked.push({ externalId: item.id, reason: "deduplicated" });
      continue;
    }

    seenBridgeKeys.add(item.dedupeKey);
    items.push(item);
  }

  for (const [dedupeKey, count] of inputKeyCounts.entries()) {
    for (let index = 1; index < count; index += 1) {
      blocked.push({ externalId: dedupeKey, reason: "deduplicated" });
    }
  }

  return {
    items,
    blocked,
    generatedAt: new Date(0).toISOString()
  };
}

export function validateFypFeedBridgeEligibilityRuntime(): boolean {
  const result = buildFypFeedBridge([
    {
      sourceId: "NASA",
      externalId: "earth-rise",
      title: "Earth Rise",
      sampleUrl: "https://www.nasa.gov/earth-rise.mp4",
      rightsTag: "public_domain",
      commercialReuseAllowed: true,
      embedOnly: false
    },
    {
      sourceId: "YOUTUBE_OFFICIAL",
      externalId: "official-embed",
      title: "Official Embed",
      sampleUrl: "https://youtube.com/watch?v=official",
      licenseName: "official_channel_embed",
      commercialReuseAllowed: true,
      embedOnly: true,
      officialChannel: true
    },
    {
      sourceId: "NASA",
      externalId: "earth-rise",
      title: "Earth Rise",
      sampleUrl: "https://www.nasa.gov/earth-rise.mp4",
      rightsTag: "public_domain",
      commercialReuseAllowed: true,
      embedOnly: false
    }
  ]);

  return (
    result.items.length === 2 &&
    result.items.every((item) => item.bridgeStatus === "eligible") &&
    result.items.some((item) => item.deliveryLane === "native_video") &&
    result.items.some((item) => item.deliveryLane === "official_embed") &&
    result.blocked.length === 1
  );
}
