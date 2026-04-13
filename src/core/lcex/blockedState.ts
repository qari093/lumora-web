import type { DisplayPermission } from "./displayPermissionClassifier";

export type BlockedState = {
  state: "blocked";
  playable: false;
  embedded: false;
  showPoster: false;
  showTitle: true;
  showMetadata: false;
  blockedMessage: string;
};

export const BLOCKED_STATE: BlockedState = {
  state: "blocked",
  playable: false,
  embedded: false,
  showPoster: false,
  showTitle: true,
  showMetadata: false,
  blockedMessage: "This item is not available for display in the current context.",
};

export function isBlockedState(
  permission: DisplayPermission
): boolean {
  return permission === "block";
}

export function resolveBlockedState(
  permission: DisplayPermission
): BlockedState | null {
  return isBlockedState(permission) ? BLOCKED_STATE : null;
}
