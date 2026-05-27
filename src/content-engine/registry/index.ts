export type ContentStatus = "staged" | "processing" | "safe" | "review" | "blocked";

export type ContentRegistryItem = {
  contentId: string;
  creatorDeviceId: string;
  status: ContentStatus;
  durationMs: number;
  categoryTags: string[];
  hlsPlaylistUrl: string;
  thumbnailUrl: string;
  resonanceIndex: number;
  presenceDepth: number;
  drift: number;
  uploadTimestamp: string;
  lastSignalAt?: string;
};

export function createContentRegistryItem(input: Partial<ContentRegistryItem> & {
  contentId: string;
  hlsPlaylistUrl: string;
  thumbnailUrl: string;
}): ContentRegistryItem {
  return {
    contentId: input.contentId,
    creatorDeviceId: input.creatorDeviceId || "anonymous-device",
    status: input.status || "safe",
    durationMs: input.durationMs || 30000,
    categoryTags: input.categoryTags || [],
    hlsPlaylistUrl: input.hlsPlaylistUrl,
    thumbnailUrl: input.thumbnailUrl,
    resonanceIndex: clamp01(input.resonanceIndex ?? 0.2),
    presenceDepth: clamp01(input.presenceDepth ?? 0),
    drift: clamp01(input.drift ?? 0),
    uploadTimestamp: input.uploadTimestamp || new Date().toISOString(),
    lastSignalAt: input.lastSignalAt,
  };
}

export function filterFeedEligibleContent(items: ContentRegistryItem[]) {
  return items.filter((item) => item.status === "safe" && item.hlsPlaylistUrl && item.thumbnailUrl);
}

export function sortContentForFeed(items: ContentRegistryItem[]) {
  return [...items].sort((a, b) => {
    const aScore = a.resonanceIndex + a.presenceDepth - a.drift;
    const bScore = b.resonanceIndex + b.presenceDepth - b.drift;
    return bScore - aScore;
  });
}

export function createFeedResponse(input: {
  items: ContentRegistryItem[];
  limit?: number;
}) {
  const limit = input.limit || 10;
  const eligible = sortContentForFeed(filterFeedEligibleContent(input.items)).slice(0, limit);

  return {
    ok: true,
    count: eligible.length,
    items: eligible.map((item) => ({
      videoId: item.contentId,
      src: item.hlsPlaylistUrl,
      thumbnailUrl: item.thumbnailUrl,
      durationMs: item.durationMs,
      categoryTags: item.categoryTags,
      resonanceIndex: item.resonanceIndex,
    })),
  };
}

export function getSeedContentRegistry(): ContentRegistryItem[] {
  return [
    createContentRegistryItem({
      contentId: "seed-calm-001",
      hlsPlaylistUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl: "/seed/thumb-calm-001.jpg",
      categoryTags: ["calm", "starter"],
      resonanceIndex: 0.3,
      presenceDepth: 0.2,
      uploadTimestamp: "2026-05-04T00:00:00.000Z",
    }),
    createContentRegistryItem({
      contentId: "seed-nature-001",
      hlsPlaylistUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      thumbnailUrl: "/seed/thumb-nature-001.jpg",
      categoryTags: ["nature", "starter"],
      resonanceIndex: 0.35,
      presenceDepth: 0.25,
      uploadTimestamp: "2026-05-04T00:00:00.000Z",
    }),
  ];
}

export function validateFeedResponse(response: ReturnType<typeof createFeedResponse>) {
  return {
    ok:
      response.ok === true &&
      Array.isArray(response.items) &&
      response.items.every((item) => item.videoId && item.src && item.thumbnailUrl),
  };
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}
