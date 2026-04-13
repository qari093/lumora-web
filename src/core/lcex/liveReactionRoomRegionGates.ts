export type LiveReactionRoomRegionGateInput = {
  viewerRegion: string;
  originRegion: string;
  allowedRegions: string[];
  blockedRegions?: string[];
  spreadMode: "full" | "limited" | "region-locked" | "manual-review" | "blocked";
};

export type LiveReactionRoomRegionGateDecision = {
  allowed: boolean;
  reason:
    | "ok"
    | "region_locked"
    | "region_blocked"
    | "manual_review_gate"
    | "fully_blocked";
};

function normalizeRegion(value: string): string {
  return value.trim().toLowerCase();
}

export function resolveLiveReactionRoomRegionGate(
  input: LiveReactionRoomRegionGateInput
): LiveReactionRoomRegionGateDecision {
  const viewerRegion = normalizeRegion(input.viewerRegion);
  const originRegion = normalizeRegion(input.originRegion);
  const allowedRegions = input.allowedRegions.map(normalizeRegion);
  const blockedRegions = (input.blockedRegions ?? []).map(normalizeRegion);

  if (input.spreadMode === "blocked") {
    return { allowed: false, reason: "fully_blocked" };
  }

  if (input.spreadMode === "manual-review") {
    return { allowed: false, reason: "manual_review_gate" };
  }

  if (blockedRegions.includes(viewerRegion)) {
    return { allowed: false, reason: "region_blocked" };
  }

  if (input.spreadMode === "region-locked") {
    const allowed =
      viewerRegion === originRegion ||
      allowedRegions.includes(viewerRegion);

    return {
      allowed,
      reason: allowed ? "ok" : "region_locked",
    };
  }

  if (allowedRegions.length > 0 && !allowedRegions.includes(viewerRegion) && !allowedRegions.includes("global")) {
    return { allowed: false, reason: "region_locked" };
  }

  return { allowed: true, reason: "ok" };
}

export function canJoinLiveReactionRoomFromRegion(
  input: LiveReactionRoomRegionGateInput
): boolean {
  return resolveLiveReactionRoomRegionGate(input).allowed;
}
