import type {
  ImpactWindow,
  RealtimeImpactReport
} from "./types";

export function calculateRealtimeImpact(
  window: ImpactWindow
): RealtimeImpactReport {
  const raw = window.signals.reduce(
    (sum, signal) => sum + signal.weight,
    0
  );

  const densityMultiplier =
    window.signals.length >= 10 ? 1.5 : 1;

  const impactQuotient = Number(
    (raw * densityMultiplier).toFixed(2)
  );

  return {
    contentId: window.contentId,
    creatorId: window.creatorId,
    impactQuotient,
    signalCount: window.signals.length,
    surge: impactQuotient >= 100
  };
}
