import { describe, expect, it } from "vitest";
import {
  createSourceHealthSignal,
  createSourceOperationalDecision,
  createSourceQuotaPolicy,
  createSourceQuotaUsage,
  evaluateSourceHealth,
  evaluateSourceQuota,
  shouldAutoPauseProvider,
  summarizeSourceOperations,
} from "@/src/core/video-ingestion";

describe("Video Ingestion Ω — Pack 07 Source Health & Quotas", () => {
  it("evaluates healthy provider signals", () => {
    const report = evaluateSourceHealth(createSourceHealthSignal({ providerId: "genesis" }));

    expect(report.providerId).toBe("genesis");
    expect(report.state).toBe("healthy");
    expect(report.score).toBeGreaterThan(0.8);
    expect(shouldAutoPauseProvider(report)).toBe(false);
  });

  it("detects degraded and paused providers", () => {
    const report = evaluateSourceHealth(
      createSourceHealthSignal({
        providerId: "unstable",
        latencyMs: 2900,
        errorRate: 0.4,
        ingestSuccessRate: 0.3,
        playbackFailureRate: 0.2,
        licenseFailureRate: 0.08,
      }),
    );

    expect(report.state === "paused" || report.state === "offline").toBe(true);
    expect(report.reasons).toContain("license_failure_high");
    expect(shouldAutoPauseProvider(report)).toBe(true);
  });

  it("enforces daily source quotas", () => {
    const policy = createSourceQuotaPolicy({
      providerId: "pexels",
      dailyAssetLimit: 10,
      maxBatchSize: 4,
    });

    const usage = createSourceQuotaUsage({
      providerId: "pexels",
      imported: 8,
    });

    const decision = evaluateSourceQuota(policy, usage, 10);

    expect(decision.allowed).toBe(true);
    expect(decision.remaining).toBe(2);
    expect(decision.batchSize).toBe(2);
  });

  it("blocks exhausted quotas", () => {
    const policy = createSourceQuotaPolicy({
      providerId: "pixabay",
      dailyAssetLimit: 5,
    });

    const usage = createSourceQuotaUsage({
      providerId: "pixabay",
      imported: 5,
    });

    const decision = evaluateSourceQuota(policy, usage, 3);

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("daily_quota_exhausted");
    expect(decision.batchSize).toBe(0);
  });

  it("combines health and quota into operational decisions", () => {
    const healthy = evaluateSourceHealth(createSourceHealthSignal({ providerId: "genesis" }));
    const quota = createSourceQuotaPolicy({ providerId: "genesis", dailyAssetLimit: 10 });
    const usage = createSourceQuotaUsage({ providerId: "genesis", imported: 1 });

    const decision = createSourceOperationalDecision(healthy, quota, usage, 3);
    const summary = summarizeSourceOperations([decision]);

    expect(decision.canIngest).toBe(true);
    expect(decision.paused).toBe(false);
    expect(summary.ready).toBe(true);
    expect(summary.active).toBe(1);
  });
});
