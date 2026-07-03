import type { ShareLifecycleState, UniversalShareObject } from "../foundation/types";

const transitions: Record<ShareLifecycleState, ShareLifecycleState[]> = {
  draft: ["validated", "revoked"],
  validated: ["queued", "revoked"],
  queued: ["delivering", "failed", "revoked"],
  delivering: ["delivered", "failed", "rolled_back"],
  delivered: ["revoked"],
  failed: ["queued", "rolled_back"],
  rolled_back: ["queued", "revoked"],
  revoked: [],
};

export function transitionShare(
  share: UniversalShareObject,
  next: ShareLifecycleState,
): UniversalShareObject {
  if (!transitions[share.lifecycle].includes(next)) {
    throw new Error(`invalid_share_lifecycle_transition:${share.lifecycle}->${next}`);
  }

  const now = new Date().toISOString();

  return {
    ...share,
    lifecycle: next,
    updatedAt: now,
    telemetry: {
      ...share.telemetry,
      deliveredAt: next === "delivered" ? now : share.telemetry.deliveredAt,
    },
  };
}
