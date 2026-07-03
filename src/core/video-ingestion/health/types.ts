export type SourceHealthState = "healthy" | "degraded" | "paused" | "offline";

export type SourceHealthSignal = {
  providerId: string;
  checkedAt: string;
  apiAvailable: boolean;
  latencyMs: number;
  errorRate: number;
  ingestSuccessRate: number;
  playbackFailureRate: number;
  licenseFailureRate: number;
  moderationRejectionRate: number;
};

export type SourceHealthReport = {
  providerId: string;
  state: SourceHealthState;
  score: number;
  signals: SourceHealthSignal;
  reasons: string[];
};

export type SourceQuotaPolicy = {
  providerId: string;
  dailyAssetLimit: number;
  maxBatchSize: number;
  priority: number;
  serenityMinimum: number;
  spectacleMaximum: number;
};

export type SourceQuotaUsage = {
  providerId: string;
  date: string;
  imported: number;
  approved: number;
  rejected: number;
};

export type SourceQuotaDecision = {
  providerId: string;
  allowed: boolean;
  remaining: number;
  batchSize: number;
  reason: string;
};
