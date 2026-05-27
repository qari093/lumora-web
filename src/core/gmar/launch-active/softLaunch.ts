export type GmarSoftLaunchStatus = {
  launchId: string;
  enabled: boolean;
  limitedUsersEnabled: boolean;
  firstLiveEventEnabled: boolean;
  zencoinRewardsEnabled: boolean;
  leaderboardEnabled: boolean;
  fypSurfacingEnabled: boolean;
  monitoringEnabled: boolean;
  dailyPatchWindowReady: boolean;
};

export function createGmarSoftLaunchStatus(input?: {
  launchId?: string;
  enabled?: boolean;
}): GmarSoftLaunchStatus {
  const launchId = input?.launchId?.trim() || "gmar_soft_launch_v1";

  if (!launchId) {
    throw new Error("GMAR soft launchId is required.");
  }

  const enabled = input?.enabled ?? true;

  return {
    launchId,
    enabled,
    limitedUsersEnabled: enabled,
    firstLiveEventEnabled: enabled,
    zencoinRewardsEnabled: enabled,
    leaderboardEnabled: enabled,
    fypSurfacingEnabled: enabled,
    monitoringEnabled: enabled,
    dailyPatchWindowReady: true
  };
}

export function assertGmarSoftLaunchStatus(
  status: GmarSoftLaunchStatus
): true {
  if (
    !status.launchId ||
    status.enabled !== true ||
    status.limitedUsersEnabled !== true ||
    status.firstLiveEventEnabled !== true ||
    status.zencoinRewardsEnabled !== true ||
    status.leaderboardEnabled !== true ||
    status.fypSurfacingEnabled !== true ||
    status.monitoringEnabled !== true ||
    status.dailyPatchWindowReady !== true
  ) {
    throw new Error("Invalid GMAR soft launch status.");
  }

  return true;
}
