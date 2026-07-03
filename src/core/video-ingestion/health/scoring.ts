import type { SourceHealthReport, SourceHealthSignal, SourceHealthState } from "./types";

function clamp(value: number) {
  return Number(Math.max(0, Math.min(1, value)).toFixed(4));
}

export function createSourceHealthSignal(input: Partial<SourceHealthSignal> & { providerId: string }): SourceHealthSignal {
  return {
    providerId: input.providerId,
    checkedAt: input.checkedAt ?? new Date().toISOString(),
    apiAvailable: input.apiAvailable ?? true,
    latencyMs: input.latencyMs ?? 250,
    errorRate: input.errorRate ?? 0,
    ingestSuccessRate: input.ingestSuccessRate ?? 1,
    playbackFailureRate: input.playbackFailureRate ?? 0,
    licenseFailureRate: input.licenseFailureRate ?? 0,
    moderationRejectionRate: input.moderationRejectionRate ?? 0,
  };
}

function healthState(score: number, reasons: string[]): SourceHealthState {
  if (reasons.includes("api_offline")) return "offline";
  if (reasons.includes("license_failure_high")) return "paused";
  if (score < 0.35) return "paused";
  if (score < 0.72) return "degraded";
  return "healthy";
}

export function evaluateSourceHealth(signal: SourceHealthSignal): SourceHealthReport {
  const reasons: string[] = [];

  if (!signal.apiAvailable) reasons.push("api_offline");
  if (signal.latencyMs > 2500) reasons.push("latency_high");
  if (signal.errorRate > 0.15) reasons.push("error_rate_high");
  if (signal.ingestSuccessRate < 0.75) reasons.push("ingest_success_low");
  if (signal.playbackFailureRate > 0.08) reasons.push("playback_failure_high");
  if (signal.licenseFailureRate > 0.03) reasons.push("license_failure_high");
  if (signal.moderationRejectionRate > 0.35) reasons.push("moderation_rejection_high");

  const latencyScore = clamp(1 - Math.min(signal.latencyMs, 3000) / 3000);
  const score = clamp(
    (signal.apiAvailable ? 0.18 : 0) +
      latencyScore * 0.12 +
      (1 - signal.errorRate) * 0.16 +
      signal.ingestSuccessRate * 0.18 +
      (1 - signal.playbackFailureRate) * 0.14 +
      (1 - signal.licenseFailureRate) * 0.12 +
      (1 - signal.moderationRejectionRate) * 0.10,
  );

  return {
    providerId: signal.providerId,
    state: healthState(score, reasons),
    score,
    signals: signal,
    reasons,
  };
}

export function shouldAutoPauseProvider(report: SourceHealthReport) {
  return report.state === "offline" || report.state === "paused" || report.reasons.includes("license_failure_high");
}
