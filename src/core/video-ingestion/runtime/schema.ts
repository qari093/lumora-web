import type { CanonicalVideoAsset, VideoLicense, VideoProvider } from "./types";
import { createStableVideoId } from "./ids";
import { createVideoChecksum } from "./hash";

export function createVideoProvider(input: Partial<VideoProvider> & {
  id: string;
  label: string;
  constitutionId: string;
}): VideoProvider {
  return {
    id: input.id,
    label: input.label,
    kind: input.kind ?? "trusted_stock",
    enabled: input.enabled ?? true,
    priority: input.priority ?? 50,
    constitutionId: input.constitutionId,
  };
}

export function createVideoLicense(input: Partial<VideoLicense> & {
  id: string;
  label: string;
  sourceUrl: string;
}): VideoLicense {
  return {
    id: input.id,
    label: input.label,
    commercialUse: input.commercialUse ?? false,
    derivativesAllowed: input.derivativesAllowed ?? false,
    attributionRequired: input.attributionRequired ?? true,
    sourceUrl: input.sourceUrl,
    verifiedAt: input.verifiedAt ?? new Date().toISOString(),
  };
}

export function createCanonicalVideoAsset(input: {
  providerId: string;
  sourceAssetId: string;
  sourceUrl: string;
  title: string;
  description?: string;
  durationSeconds: number;
  width: number;
  height: number;
  hasAudio: boolean;
  mimeType: string;
  license: VideoLicense;
  attribution: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}): CanonicalVideoAsset {
  const now = new Date().toISOString();
  const id = createStableVideoId([input.providerId, input.sourceAssetId, input.sourceUrl]);

  return {
    id,
    version: "uvip.v1",
    providerId: input.providerId,
    sourceAssetId: input.sourceAssetId,
    sourceUrl: input.sourceUrl,
    title: input.title,
    description: input.description,
    durationSeconds: input.durationSeconds,
    width: input.width,
    height: input.height,
    hasAudio: input.hasAudio,
    mimeType: input.mimeType,
    license: input.license,
    attribution: input.attribution,
    checksum: createVideoChecksum(`${input.providerId}:${input.sourceAssetId}:${input.sourceUrl}`),
    lifecycle: "discovered",
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
    metadata: input.metadata ?? {},
  };
}
