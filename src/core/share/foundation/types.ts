export const UNIVERSAL_SHARE_VERSION = "usl.v1" as const;

export type SharePortal =
  | "fyp"
  | "lumaspace"
  | "lumalink"
  | "live"
  | "zendoro"
  | "lumexa"
  | "creator_hub"
  | "memory_vault"
  | "community"
  | "external";

export type ShareObjectKind =
  | "post"
  | "video"
  | "audio"
  | "memory"
  | "star"
  | "garden"
  | "constellation"
  | "journey_capsule"
  | "time_capsule"
  | "product"
  | "live_room"
  | "creator"
  | "collection"
  | "link";

export type ShareLifecycleState =
  | "draft"
  | "validated"
  | "queued"
  | "delivering"
  | "delivered"
  | "failed"
  | "rolled_back"
  | "revoked";

export type ShareVisibility =
  | "private"
  | "friends"
  | "family"
  | "group"
  | "community"
  | "public"
  | "external";

export type UniversalShareObject = {
  id: string;
  version: typeof UNIVERSAL_SHARE_VERSION;
  kind: ShareObjectKind;
  sourcePortal: SharePortal;
  destinationPortal: SharePortal;
  sourceObjectId: string;
  title: string;
  description?: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  ownerId: string;
  lifecycle: ShareLifecycleState;
  visibility: ShareVisibility;
  integrityHash: string;
  metadata: {
    mood?: string;
    note?: string;
    atmosphere?: string;
    language?: string;
    aiSummary?: string;
    tags: string[];
    canonicalPath?: string;
    transformation?: string;
    echo?: boolean;
    echoShare?: boolean;
    echoDurationSeconds?: number;
    voiceDurationSeconds?: number;
  };
  permissions: {
    canView: boolean;
    canReshare: boolean;
    canRemix: boolean;
    canDownload: boolean;
    commercialUse: boolean;
    requiresAttribution: boolean;
    expiresAt?: string;
  };
  telemetry: {
    attempts: number;
    lastAttemptAt?: string;
    deliveredAt?: string;
    failedReason?: string;
    latencyMs?: number;
  };
};

export type CreateShareInput = {
  kind: ShareObjectKind;
  sourcePortal: SharePortal;
  destinationPortal: SharePortal;
  sourceObjectId: string;
  title: string;
  description?: string;
  url?: string;
  createdBy: string;
  ownerId?: string;
  visibility?: ShareVisibility;
  metadata?: Partial<UniversalShareObject["metadata"]>;
  permissions?: Partial<UniversalShareObject["permissions"]>;
};
