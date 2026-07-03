import type { UniversalShareObject } from "../foundation/types";
import type {
  CrossPortalAdapter,
  CrossPortalArtifactKind,
  CrossPortalTarget,
  CrossPortalTransformation,
} from "./types";

function readShareMetadata(share: UniversalShareObject): Record<string, unknown> {
  const metadata = share.metadata;
  return metadata && typeof metadata === "object" ? (metadata as Record<string, unknown>) : {};
}

function baseTransformation(
  share: UniversalShareObject,
  targetPortal: CrossPortalTarget,
  artifactKind: CrossPortalArtifactKind,
  label: string,
  visualForm: string,
  actionLabel: string,
): CrossPortalTransformation {
  const metadata = readShareMetadata(share);
  const mood = typeof metadata.mood === "string" ? metadata.mood : "wonder";
  const atmosphere = typeof metadata.atmosphere === "string" ? metadata.atmosphere : `${mood}-atmosphere`;

  return {
    shareId: share.id,
    sourcePortal: String(share.sourcePortal),
    targetPortal,
    artifactKind,
    identityPreserved: true,
    title: share.title,
    presentation: {
      label,
      atmosphere,
      visualForm,
      actionLabel,
    },
    payload: {
      sourceObjectId: share.sourceObjectId,
      canonicalShareId: share.id,
      transformedObjectId: `${targetPortal}_${artifactKind}_${share.id}`,
      metadata: {
        ...metadata,
        sourcePortal: share.sourcePortal,
        targetPortal,
        artifactKind,
      },
    },
    rights: {
      attributionRequired: true,
      originalCreatorId: share.createdBy,
      remixAllowed: Boolean(metadata.remixAllowed ?? false),
      downloadAllowed: Boolean(metadata.downloadAllowed ?? false),
    },
    deliveryHints: {
      preferredMode: String(metadata.preferredMode ?? "instant"),
      passiveDiscovery: targetPortal === "lumaspace" || targetPortal === "memory_vault",
      notificationIntensity:
        targetPortal === "lumaspace" || targetPortal === "memory_vault"
          ? "silent"
          : targetPortal === "lumalink" || targetPortal === "live"
            ? "gentle"
            : "standard",
    },
  };
}

export const crossPortalAdapters: CrossPortalAdapter[] = [
  {
    targetPortal: "fyp",
    artifactKind: "fyp_story",
    transform: (share) => baseTransformation(share, "fyp", "fyp_story", "FYP Story", "vertical story card", "Watch"),
  },
  {
    targetPortal: "lumaspace",
    artifactKind: "memory_star",
    transform: (share) =>
      baseTransformation(share, "lumaspace", "memory_star", "Memory Star", "breathing constellation star", "Place in Space"),
  },
  {
    targetPortal: "lumalink",
    artifactKind: "conversation_card",
    transform: (share) =>
      baseTransformation(share, "lumalink", "conversation_card", "Conversation Card", "relationship bridge card", "Start conversation"),
  },
  {
    targetPortal: "live",
    artifactKind: "watch_moment",
    transform: (share) =>
      baseTransformation(share, "live", "watch_moment", "Watch Moment", "shared room moment", "Bring into Live"),
  },
  {
    targetPortal: "zendoro",
    artifactKind: "giftable_recommendation",
    transform: (share) =>
      baseTransformation(share, "zendoro", "giftable_recommendation", "Giftable Recommendation", "commerce gift card", "Gift this"),
  },
  {
    targetPortal: "lumexa",
    artifactKind: "commerce_card",
    transform: (share) =>
      baseTransformation(share, "lumexa", "commerce_card", "Lumexa Commerce Card", "searchable product memory", "Explore"),
  },
  {
    targetPortal: "creator_hub",
    artifactKind: "creator_signal",
    transform: (share) =>
      baseTransformation(share, "creator_hub", "creator_signal", "Creator Signal", "creator analytics signal", "Review impact"),
  },
  {
    targetPortal: "memory_vault",
    artifactKind: "archived_memory",
    transform: (share) =>
      baseTransformation(share, "memory_vault", "archived_memory", "Archived Memory", "vault memory capsule", "Archive"),
  },
  {
    targetPortal: "community",
    artifactKind: "community_seed",
    transform: (share) =>
      baseTransformation(share, "community", "community_seed", "Community Seed", "shared community node", "Plant seed"),
  },
  {
    targetPortal: "external",
    artifactKind: "universal_link",
    transform: (share) =>
      baseTransformation(share, "external", "universal_link", "Universal Link", "external preview link", "Open link"),
  },
];
