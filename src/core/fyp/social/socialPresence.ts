import type { AtmosphereMode } from "../core/types";
import type { SyncPrivacyState } from "../privacy/syncPrivacy";
import { canExposeSyncPresence } from "../privacy/syncPrivacy";

export type SocialPresenceSignal = {
  userId: string;
  mode: AtmosphereMode;
  groupId?: string;
  anonymous: boolean;
  visible: boolean;
  timestamp: number;
};

export function createSocialPresenceSignal(input: {
  userId: string;
  mode: AtmosphereMode;
  privacy: SyncPrivacyState;
  groupId?: string;
  now?: number;
}): SocialPresenceSignal {
  return {
    userId: input.privacy.visibility === "anonymous" ? "anonymous" : input.userId,
    mode: input.mode,
    groupId: input.groupId,
    anonymous: input.privacy.visibility === "anonymous",
    visible: canExposeSyncPresence(input.privacy),
    timestamp: input.now ?? Date.now()
  };
}
