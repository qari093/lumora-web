export interface OfflineEmotionalSnapshot {
  creatorId: string;
  capturedAt: string;
  dashboardStateKey: string;
  safeToShowOffline: boolean;
}

export function createOfflineEmotionalSnapshot(input: OfflineEmotionalSnapshot): OfflineEmotionalSnapshot {
  return {
    creatorId: input.creatorId,
    capturedAt: input.capturedAt,
    dashboardStateKey: input.dashboardStateKey,
    safeToShowOffline: input.safeToShowOffline
  };
}
