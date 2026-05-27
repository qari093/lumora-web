export type SessionSnapshot = {
  skipRate: number;
  holdRate: number;
  emotionalDrift: number;
};

export function smoothSession(
  history: SessionSnapshot[],
  current: SessionSnapshot,
): SessionSnapshot {
  const last = history.slice(-10);
  const all = [...last, current];

  const avg = (key: keyof SessionSnapshot) =>
    all.reduce((sum, v) => sum + v[key], 0) / all.length;

  return {
    skipRate: avg("skipRate"),
    holdRate: avg("holdRate"),
    emotionalDrift: avg("emotionalDrift"),
  };
}
