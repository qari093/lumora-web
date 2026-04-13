export type MonitoringLoggingActivationInput = {
  logsEnabled?: boolean | null;
  metricsEnabled?: boolean | null;
  alertsEnabled?: boolean | null;
  traceSamplingPct?: number | null;
};

export type MonitoringLoggingActivationResult =
  | {
      ok: true;
      activation: {
        logsEnabled: boolean;
        metricsEnabled: boolean;
        alertsEnabled: boolean;
        traceSamplingPct: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateMonitoringLoggingActivation(
  input: MonitoringLoggingActivationInput
): MonitoringLoggingActivationResult {
  const logsEnabled = Boolean(input.logsEnabled);
  const metricsEnabled = Boolean(input.metricsEnabled);
  const alertsEnabled = Boolean(input.alertsEnabled);
  const traceSamplingPct =
    typeof input.traceSamplingPct === "number" && Number.isFinite(input.traceSamplingPct)
      ? input.traceSamplingPct
      : NaN;

  if (!Number.isFinite(traceSamplingPct) || traceSamplingPct < 0 || traceSamplingPct > 100) {
    return { ok: false, reason: "invalid_trace_sampling_pct" };
  }

  return {
    ok: true,
    activation: {
      logsEnabled,
      metricsEnabled,
      alertsEnabled,
      traceSamplingPct,
      ready: logsEnabled && metricsEnabled && alertsEnabled,
    },
  };
}
