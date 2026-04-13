import type { DisplayPermission } from "./displayPermissionClassifier";

export type MetadataOnlyState = {
  state: "metadata-only";
  playable: false;
  embedded: false;
  showPoster: boolean;
  showTitle: true;
  showMetadata: true;
};

export const METADATA_ONLY_STATE: MetadataOnlyState = {
  state: "metadata-only",
  playable: false,
  embedded: false,
  showPoster: true,
  showTitle: true,
  showMetadata: true,
};

export function isMetadataOnlyState(
  permission: DisplayPermission
): boolean {
  return permission === "metadata-only";
}

export function resolveMetadataOnlyState(
  permission: DisplayPermission
): MetadataOnlyState | null {
  return isMetadataOnlyState(permission) ? METADATA_ONLY_STATE : null;
}
