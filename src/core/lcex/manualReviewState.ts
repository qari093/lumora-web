import type { DisplayPermission } from "./displayPermissionClassifier";

export type ManualReviewState = {
  state: "manual-review";
  playable: false;
  embedded: false;
  showPoster: true;
  showTitle: true;
  showMetadata: true;
  reviewMessage: string;
};

export const MANUAL_REVIEW_STATE: ManualReviewState = {
  state: "manual-review",
  playable: false,
  embedded: false,
  showPoster: true,
  showTitle: true,
  showMetadata: true,
  reviewMessage: "This item is temporarily limited while Lumora reviews it for safe display.",
};

export function isManualReviewState(
  permission: DisplayPermission
): boolean {
  return permission === "manual-review";
}

export function resolveManualReviewState(
  permission: DisplayPermission
): ManualReviewState | null {
  return isManualReviewState(permission) ? MANUAL_REVIEW_STATE : null;
}
