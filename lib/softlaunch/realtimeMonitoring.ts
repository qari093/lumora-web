export type MonitoringInput = {
  healthEnabled?: boolean | null;
  sessionTrackingEnabled?: boolean | null;
  fypMetricsEnabled?: boolean | null;
  errorTrackingEnabled?: boolean | null;
  refreshIntervalSec?: number | null;
};

export type MonitoringResult =
  | {
      ok: true;
      monitoring: {
        active: boolean;
        healthEnabled: boolean;
        sessionTrackingEnabled: boolean;
        fypMetricsEnabled: boolean;
        errorTrackingEnabled: boolean;
        refreshIntervalSec: number;
      };
    }
  | { ok: false; reason: string };

export function resolveRealtimeMonitoring(
  input: MonitoringInput
): MonitoringResult {
  const healthEnabled = Boolean(input.healthEnabled);
  const sessionTrackingEnabled = Boolean(input.sessionTrackingEnabled);
  const fypMetricsEnabled = Boolean(input.fypMetricsEnabled);
  const errorTrackingEnabled = Boolean(input.errorTrackingEnabled);
  const refreshIntervalSec =
    typeof input.refreshIntervalSec === "number" && Number.isFinite(input.refreshIntervalSec)
      ? Math.trunc(input.refreshIntervalSec)
      : NaN;

  if (!Number.isFinite(refreshIntervalSec) || refreshIntervalSec < 5 || refreshIntervalSec > 300) {
    return { ok: false, reason: "invalid_refresh_interval" };
  }

  const active =
    healthEnabled &&
    sessionTrackingEnabled &&
    fypMetricsEnabled &&
    errorTrackingEnabled;

  return {
    ok: true,
    monitoring: {
      active,
      healthEnabled,
      sessionTrackingEnabled,
      fypMetricsEnabled,
      errorTrackingEnabled,
      refreshIntervalSec,
    },
  };
}
