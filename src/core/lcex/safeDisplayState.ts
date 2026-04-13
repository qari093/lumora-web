import type { DisplayPermission } from "./displayPermissionClassifier";

export type SafeDisplayState = {
  state: "safe-display";
  playable: boolean;
  showPoster: boolean;
  showTitle: boolean;
  showMetadata: boolean;
};

export const SAFE_DISPLAY_STATE: SafeDisplayState = {
  state: "safe-display",
  playable: true,
  showPoster: true,
  showTitle: true,
  showMetadata: true,
};

export function isSafeDisplayState(
  permission: DisplayPermission
): boolean {
  return permission === "allow-display";
}

export function resolveSafeDisplayState(
  permission: DisplayPermission
): SafeDisplayState | null {
  return isSafeDisplayState(permission) ? SAFE_DISPLAY_STATE : null;
}
