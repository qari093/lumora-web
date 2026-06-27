export interface FypFeatureFlags {
  playbackV2: boolean;
  fallbackV2: boolean;
  depthCanvas: boolean;
  freshnessEngine: boolean;
  preferenceSignals: boolean;
}

export interface CanaryConfig {
  enabled: boolean;
  rolloutPercent: number;
}

export interface RollbackState {
  enabled: boolean;
  lastKnownGoodBuild: string;
}

export interface SnapshotState {
  createdAt: string;
  buildId: string;
}
