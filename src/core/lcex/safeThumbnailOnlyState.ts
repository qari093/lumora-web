import type { DisplayPermission } from "./displayPermissionClassifier";

export type SafeThumbnailOnlyState = {
  state: "thumbnail-only";
  playable: false;
  embedded: false;
  showPoster: true;
  showTitle: true;
  showMetadata: true;
  showThumbnailBadge: true;
};

export const SAFE_THUMBNAIL_ONLY_STATE: SafeThumbnailOnlyState = {
  state: "thumbnail-only",
  playable: false,
  embedded: false,
  showPoster: true,
  showTitle: true,
  showMetadata: true,
  showThumbnailBadge: true,
};

export function isSafeThumbnailOnlyState(
  permission: DisplayPermission
): boolean {
  return permission === "thumbnail-only";
}

export function resolveSafeThumbnailOnlyState(
  permission: DisplayPermission
): SafeThumbnailOnlyState | null {
  return isSafeThumbnailOnlyState(permission)
    ? SAFE_THUMBNAIL_ONLY_STATE
    : null;
}
