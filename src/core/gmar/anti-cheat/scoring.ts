export type AbuseSignal = {
  impossibleScoreDelta?: boolean;
  eventSpamRate?: number;
  clientClockDriftMs?: number;
};

export function scoreAbuseRisk(signal: AbuseSignal): number {
  let score = 0;
  if (signal.impossibleScoreDelta) score += 50;
  if ((signal.eventSpamRate ?? 0) > 120) score += 30;
  if (Math.abs(signal.clientClockDriftMs ?? 0) > 10000) score += 20;
  return Math.min(score, 100);
}
