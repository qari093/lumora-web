export type SystemHealthSignalSurface =
  | "discovery"
  | "live-room"
  | "versus"
  | "prediction-pick"
  | "mood-board"
  | "fandom-badge"
  | "identity"
  | "habit"
  | "trust";

export type SystemHealthSignalSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type SystemHealthSignalRecord = {
  id: string;
  surface: SystemHealthSignalSurface;
  signalType: string;
  severity: SystemHealthSignalSeverity;
  createdAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export const SYSTEM_HEALTH_SIGNAL_REGISTRY: SystemHealthSignalRecord[] = [];

export function registerSystemHealthSignal(
  signal: SystemHealthSignalRecord
): void {
  SYSTEM_HEALTH_SIGNAL_REGISTRY.push({
    ...signal,
    id: signal.id.trim(),
    signalType: signal.signalType.trim(),
  });
}

export function getSystemHealthSignalById(
  id: string
): SystemHealthSignalRecord | undefined {
  const normalizedId = id.trim();
  return SYSTEM_HEALTH_SIGNAL_REGISTRY.find((signal) => signal.id === normalizedId);
}

export function getOpenSystemHealthSignals(): SystemHealthSignalRecord[] {
  return [...SYSTEM_HEALTH_SIGNAL_REGISTRY].sort((a, b) => {
    const rank: Record<SystemHealthSignalSeverity, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    const severityDelta = rank[a.severity] - rank[b.severity];
    if (severityDelta !== 0) return severityDelta;

    const aTs = Date.parse(a.createdAt);
    const bTs = Date.parse(b.createdAt);
    return (Number.isNaN(bTs) ? 0 : bTs) - (Number.isNaN(aTs) ? 0 : aTs);
  });
}
