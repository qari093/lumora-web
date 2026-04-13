import type { DisplayPermission } from "./displayPermissionClassifier";

export type SafeEmbedState = {
  state: "safe-embed";
  playable: true;
  embedded: true;
  showPoster: true;
  showTitle: true;
  showMetadata: true;
};

export const SAFE_EMBED_STATE: SafeEmbedState = {
  state: "safe-embed",
  playable: true,
  embedded: true,
  showPoster: true,
  showTitle: true,
  showMetadata: true,
};

export function isSafeEmbedState(
  permission: DisplayPermission
): boolean {
  return permission === "allow-embed";
}

export function resolveSafeEmbedState(
  permission: DisplayPermission
): SafeEmbedState | null {
  return isSafeEmbedState(permission) ? SAFE_EMBED_STATE : null;
}
