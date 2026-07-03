import type { UniversalShareObject } from "../foundation/types";

export type CrossPortalTarget =
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

export type CrossPortalArtifactKind =
  | "fyp_story"
  | "memory_star"
  | "conversation_card"
  | "watch_moment"
  | "giftable_recommendation"
  | "commerce_card"
  | "creator_signal"
  | "archived_memory"
  | "community_seed"
  | "universal_link";

export type CrossPortalTransformation = {
  shareId: string;
  sourcePortal: string;
  targetPortal: CrossPortalTarget;
  artifactKind: CrossPortalArtifactKind;
  identityPreserved: true;
  title: string;
  presentation: {
    label: string;
    atmosphere: string;
    visualForm: string;
    actionLabel: string;
  };
  payload: {
    sourceObjectId: string;
    canonicalShareId: string;
    transformedObjectId: string;
    metadata: Record<string, unknown>;
  };
  rights: {
    attributionRequired: true;
    originalCreatorId: string;
    remixAllowed: boolean;
    downloadAllowed: boolean;
  };
  deliveryHints: {
    preferredMode: string;
    passiveDiscovery: boolean;
    notificationIntensity: "silent" | "gentle" | "standard";
  };
};

export type CrossPortalAdapter = {
  targetPortal: CrossPortalTarget;
  artifactKind: CrossPortalArtifactKind;
  transform: (share: UniversalShareObject) => CrossPortalTransformation;
};
