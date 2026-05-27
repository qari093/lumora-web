export type HlsVariant = {
  label: "360p" | "720p" | "1080p";
  width: number;
  height: number;
  bitrateKbps: number;
  playlistUrl: string;
};

export type HlsOutput = {
  contentId: string;
  masterPlaylistUrl: string;
  segmentDurationSec: 2;
  audioCodec: "aac";
  audioBitrateKbps: 128;
  variants: HlsVariant[];
};

export type ThumbnailOutput = {
  contentId: string;
  thumbnailUrl: string;
  frameAtSec: 1.5;
  width: 1280;
  height: 720;
};

export type ContentMetadata = {
  contentId: string;
  durationSec: number;
  autoTags: string[];
  perceptualHash: string;
  audioFingerprint: string;
  videoQualityScore: number;
  audioQualityScore: number;
  processedAt: string;
};

export function buildHlsOutput(input: {
  contentId: string;
  baseUrl: string;
  creatorTrusted?: boolean;
}): HlsOutput {
  const variants: HlsVariant[] = [
    {
      label: "360p",
      width: 640,
      height: 360,
      bitrateKbps: 800,
      playlistUrl: `${input.baseUrl}/${input.contentId}/360p/index.m3u8`,
    },
    {
      label: "720p",
      width: 1280,
      height: 720,
      bitrateKbps: 2500,
      playlistUrl: `${input.baseUrl}/${input.contentId}/720p/index.m3u8`,
    },
  ];

  if (input.creatorTrusted) {
    variants.push({
      label: "1080p",
      width: 1920,
      height: 1080,
      bitrateKbps: 4500,
      playlistUrl: `${input.baseUrl}/${input.contentId}/1080p/index.m3u8`,
    });
  }

  return {
    contentId: input.contentId,
    masterPlaylistUrl: `${input.baseUrl}/${input.contentId}/master.m3u8`,
    segmentDurationSec: 2,
    audioCodec: "aac",
    audioBitrateKbps: 128,
    variants,
  };
}

export function buildThumbnailOutput(input: {
  contentId: string;
  baseUrl: string;
}): ThumbnailOutput {
  return {
    contentId: input.contentId,
    thumbnailUrl: `${input.baseUrl}/${input.contentId}/thumb-001.jpg`,
    frameAtSec: 1.5,
    width: 1280,
    height: 720,
  };
}

export function buildContentMetadata(input: {
  contentId: string;
  durationSec: number;
  tags?: string[];
  perceptualHash?: string;
  audioFingerprint?: string;
  videoQualityScore?: number;
  audioQualityScore?: number;
  processedAt?: string;
}): ContentMetadata {
  return {
    contentId: input.contentId,
    durationSec: input.durationSec,
    autoTags: input.tags || [],
    perceptualHash: input.perceptualHash || `phash_${input.contentId}`,
    audioFingerprint: input.audioFingerprint || `afp_${input.contentId}`,
    videoQualityScore: clamp01(input.videoQualityScore ?? 0.75),
    audioQualityScore: clamp01(input.audioQualityScore ?? 0.75),
    processedAt: input.processedAt || new Date().toISOString(),
  };
}

export function createProcessedContentOutput(input: {
  contentId: string;
  baseUrl: string;
  durationSec: number;
  creatorTrusted?: boolean;
  tags?: string[];
}) {
  const hls = buildHlsOutput({
    contentId: input.contentId,
    baseUrl: input.baseUrl,
    creatorTrusted: input.creatorTrusted,
  });

  const thumbnail = buildThumbnailOutput({
    contentId: input.contentId,
    baseUrl: input.baseUrl,
  });

  const metadata = buildContentMetadata({
    contentId: input.contentId,
    durationSec: input.durationSec,
    tags: input.tags,
  });

  return {
    contentId: input.contentId,
    hls,
    thumbnail,
    metadata,
    eventType: "content.processing.complete" as const,
  };
}

export function validateProcessedOutput(output: ReturnType<typeof createProcessedContentOutput>) {
  const ok = Boolean(
    output.contentId &&
      output.hls.masterPlaylistUrl.endsWith("master.m3u8") &&
      output.hls.segmentDurationSec === 2 &&
      output.hls.audioCodec === "aac" &&
      output.thumbnail.thumbnailUrl.endsWith(".jpg") &&
      output.metadata.perceptualHash &&
      output.metadata.audioFingerprint,
  );

  return {
    ok,
    reason: ok ? "processed_output_valid" : "processed_output_invalid",
  };
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}
