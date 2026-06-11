import {
  buildFypFeedBridge,
  type FypFeedBridgeItem
} from "@/src/core/fyp/ingestion/feedBridge";

import type { FypIngestionJobInput } from "@/src/core/fyp/ingestion/ingestionQueue";

export type FypRuntimeTraceLane = "wonder" | "learn" | "laugh" | "build" | "explore";

export type FypRuntimeApiFeedItem = {
  id: string;
  sourceId: string;
  sourceLabel: string;
  title: string;
  creator: string;
  playbackUrl: string;
  deliveryLane: "native_video" | "official_embed";
  licenseName: string;
  attribution: string;
  durationSeconds: number;
  rankingSeed: number;
  safetyTags: string[];
  traceLane: FypRuntimeTraceLane;
};

export type FypRuntimeApiFeedResponse = {
  ok: boolean;
  generatedAt: string;
  count: number;
  items: FypRuntimeApiFeedItem[];
  blocked: number;
  source: "lumora_fyp_ingestion_bridge";
};

export const DEFAULT_RUNTIME_FEED_INPUTS: FypIngestionJobInput[] = [
  {
    sourceId: "NASA",
    externalId: "nasa-earth-rise",
    title: "Earth Rise",
    creator: "NASA",
    sampleUrl: "https://www.nasa.gov/earth-rise.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 42
  },
  {
    sourceId: "ESA",
    externalId: "esa-orbit-view",
    title: "Orbit View",
    creator: "ESA",
    sampleUrl: "https://www.esa.int/orbit-view.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 38
  },
  {
    sourceId: "YOUTUBE_OFFICIAL",
    externalId: "official-trailer-feed",
    title: "Official Channel Feature",
    creator: "Official Channel",
    sampleUrl: "https://youtube.com/watch?v=official-feed",
    licenseName: "official_channel_embed",
    commercialReuseAllowed: true,
    embedOnly: true,
    officialChannel: true,
    durationSeconds: 90
  }
];

function traceLaneFromItem(item: FypFeedBridgeItem): FypRuntimeTraceLane {
  if (item.sourceId === "NASA" || item.sourceId === "ESA") return "wonder";
  if (item.deliveryLane === "official_embed") return "explore";
  if (item.durationSeconds > 60) return "learn";
  return "build";
}

export function adaptFypBridgeItemToRuntimeApi(item: FypFeedBridgeItem): FypRuntimeApiFeedItem {
  return {
    id: item.id,
    sourceId: item.sourceId,
    sourceLabel: item.sourceLabel,
    title: item.title,
    creator: item.creator,
    playbackUrl: item.url,
    deliveryLane: item.deliveryLane,
    licenseName: item.licenseName,
    attribution: item.attribution,
    durationSeconds: item.durationSeconds,
    rankingSeed: item.rankingSeed,
    safetyTags: item.safetyTags,
    traceLane: traceLaneFromItem(item)
  };
}

export function buildFypRuntimeApiFeed(
  inputs: FypIngestionJobInput[] = DEFAULT_RUNTIME_FEED_INPUTS
): FypRuntimeApiFeedResponse {
  const bridge = buildFypFeedBridge(inputs);
  const items = bridge.items.map(adaptFypBridgeItemToRuntimeApi);

  return {
    ok: true,
    generatedAt: bridge.generatedAt,
    count: items.length,
    items,
    blocked: bridge.blocked.length,
    source: "lumora_fyp_ingestion_bridge"
  };
}

export function validateFypRuntimeApiFeedBridge(): boolean {
  const response = buildFypRuntimeApiFeed();

  return (
    response.ok === true &&
    response.source === "lumora_fyp_ingestion_bridge" &&
    response.count >= 3 &&
    response.items.every((item) =>
      Boolean(item.id) &&
      Boolean(item.playbackUrl) &&
      Boolean(item.title) &&
      Boolean(item.creator) &&
      Boolean(item.licenseName) &&
      item.safetyTags.includes("rights_verified") &&
      ["native_video", "official_embed"].includes(item.deliveryLane) &&
      ["wonder", "learn", "laugh", "build", "explore"].includes(item.traceLane)
    )
  );
}
