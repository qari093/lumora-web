import type { RightsState } from "./rightsGateRegistry";
import type { TrustState } from "./trustState";

export type DisplayPermission =
  | "allow-display"
  | "allow-embed"
  | "metadata-only"
  | "thumbnail-only"
  | "manual-review"
  | "block";

export type DisplayPermissionInput = {
  rightsState: RightsState;
  trustState: TrustState;
  ageRestricted: boolean;
};

export function classifyDisplayPermission(
  input: DisplayPermissionInput
): DisplayPermission {
  if (input.rightsState === "blocked") return "block";
  if (input.rightsState === "manual-review") return "manual-review";
  if (input.ageRestricted && input.rightsState !== "metadata-only") {
    return "manual-review";
  }
  if (input.rightsState === "safe-embed" && input.trustState !== "unverified" && input.trustState !== "suppressed") {
    return "allow-embed";
  }
  if (input.rightsState === "safe-display" && input.trustState !== "suppressed") {
    return "allow-display";
  }
  if (input.rightsState === "thumbnail-only") return "thumbnail-only";
  return "metadata-only";
}

export function canRenderPlayableMedia(
  permission: DisplayPermission
): boolean {
  return permission === "allow-display" || permission === "allow-embed";
}
