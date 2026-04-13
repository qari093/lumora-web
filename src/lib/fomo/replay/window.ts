export type ReplayWindow = {
  startAt: number;
  endAt: number;
  active: boolean;
};

export function buildReplayWindow(durationMin = 30): ReplayWindow {
  const startAt = Date.now();
  const endAt = startAt + durationMin * 60 * 1000;
  return {
    startAt,
    endAt,
    active: true,
  };
}
