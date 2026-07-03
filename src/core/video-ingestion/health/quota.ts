import type { SourceQuotaDecision, SourceQuotaPolicy, SourceQuotaUsage } from "./types";

export function createSourceQuotaPolicy(input: Partial<SourceQuotaPolicy> & { providerId: string }): SourceQuotaPolicy {
  return {
    providerId: input.providerId,
    dailyAssetLimit: input.dailyAssetLimit ?? 100,
    maxBatchSize: input.maxBatchSize ?? 25,
    priority: input.priority ?? 50,
    serenityMinimum: input.serenityMinimum ?? 0.6,
    spectacleMaximum: input.spectacleMaximum ?? 0.7,
  };
}

export function createSourceQuotaUsage(input: Partial<SourceQuotaUsage> & { providerId: string }): SourceQuotaUsage {
  return {
    providerId: input.providerId,
    date: input.date ?? new Date().toISOString().slice(0, 10),
    imported: input.imported ?? 0,
    approved: input.approved ?? 0,
    rejected: input.rejected ?? 0,
  };
}

export function evaluateSourceQuota(policy: SourceQuotaPolicy, usage: SourceQuotaUsage, requestedBatchSize: number): SourceQuotaDecision {
  const remaining = Math.max(0, policy.dailyAssetLimit - usage.imported);
  const batchSize = Math.min(policy.maxBatchSize, requestedBatchSize, remaining);

  if (remaining <= 0) {
    return {
      providerId: policy.providerId,
      allowed: false,
      remaining,
      batchSize: 0,
      reason: "daily_quota_exhausted",
    };
  }

  return {
    providerId: policy.providerId,
    allowed: batchSize > 0,
    remaining,
    batchSize,
    reason: "quota_available",
  };
}
