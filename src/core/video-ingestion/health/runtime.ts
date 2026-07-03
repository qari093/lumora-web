import type {
  SourceHealthReport,
  SourceQuotaDecision,
  SourceQuotaPolicy,
  SourceQuotaUsage,
} from "./types";
import { evaluateSourceQuota } from "./quota";
import { shouldAutoPauseProvider } from "./scoring";

export type SourceOperationalDecision = {
  providerId: string;
  canIngest: boolean;
  paused: boolean;
  health: SourceHealthReport;
  quota: SourceQuotaDecision;
  reasons: string[];
};

export function createSourceOperationalDecision(
  health: SourceHealthReport,
  policy: SourceQuotaPolicy,
  usage: SourceQuotaUsage,
  requestedBatchSize: number,
): SourceOperationalDecision {
  const quota = evaluateSourceQuota(policy, usage, requestedBatchSize);
  const paused = shouldAutoPauseProvider(health);
  const reasons = [
    ...health.reasons,
    ...(quota.allowed ? [] : [quota.reason]),
  ];

  return {
    providerId: health.providerId,
    canIngest: !paused && quota.allowed,
    paused,
    health,
    quota,
    reasons,
  };
}

export function summarizeSourceOperations(decisions: SourceOperationalDecision[]) {
  const active = decisions.filter((item) => item.canIngest).length;
  const paused = decisions.filter((item) => item.paused).length;

  return {
    total: decisions.length,
    active,
    paused,
    blocked: decisions.length - active,
    ready: decisions.length > 0 && active > 0,
  };
}
