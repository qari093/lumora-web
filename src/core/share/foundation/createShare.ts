import { createStableHash } from "./hash";
import { createShareId } from "./ids";
import {
  UNIVERSAL_SHARE_VERSION,
  type CreateShareInput,
  type UniversalShareObject,
} from "./types";
import { validateUniversalShareObject } from "./validator";
export type { CreateShareInput } from "./types";

export function createUniversalShareObject(input: CreateShareInput): UniversalShareObject {
  const now = new Date().toISOString();
  const ownerId = input.ownerId ?? input.createdBy;

  const base = {
    version: UNIVERSAL_SHARE_VERSION,
    kind: input.kind,
    sourcePortal: input.sourcePortal,
    destinationPortal: input.destinationPortal,
    sourceObjectId: input.sourceObjectId,
    title: input.title,
    createdAt: now,
    createdBy: input.createdBy,
    ownerId,
  };

  const share: UniversalShareObject = {
    id: createShareId(`${input.sourcePortal}:${input.destinationPortal}:${input.sourceObjectId}`, now),
    ...base,
    description: input.description,
    url: input.url,
    updatedAt: now,
    lifecycle: "draft",
    visibility: input.visibility ?? "private",
    integrityHash: createStableHash(base),
    metadata: {
      mood: input.metadata?.mood,
      note: input.metadata?.note,
      atmosphere: input.metadata?.atmosphere,
      language: input.metadata?.language,
      aiSummary: input.metadata?.aiSummary,
      tags: input.metadata?.tags ?? [],
      canonicalPath: input.metadata?.canonicalPath,
      transformation: input.metadata?.transformation,
      echo: input.metadata?.echo,
      echoShare: input.metadata?.echoShare,
      echoDurationSeconds: input.metadata?.echoDurationSeconds,
      voiceDurationSeconds: input.metadata?.voiceDurationSeconds,
    },
    permissions: {
      canView: input.permissions?.canView ?? true,
      canReshare: input.permissions?.canReshare ?? true,
      canRemix: input.permissions?.canRemix ?? false,
      canDownload: input.permissions?.canDownload ?? false,
      commercialUse: input.permissions?.commercialUse ?? false,
      requiresAttribution: input.permissions?.requiresAttribution ?? true,
      expiresAt: input.permissions?.expiresAt,
    },
    telemetry: {
      attempts: 0,
    },
  };

  const validation = validateUniversalShareObject(share);
  if (!validation.ok) {
    throw new Error(`invalid_universal_share_object:${validation.errors.join(",")}`);
  }

  return share;
}
