export type TimerInput = {
  startAt: number;
  durationSeconds: number;
  now?: number;
};

export type TimerResult = {
  startAt: number;
  endsAt: number;
  now: number;
  remainingSeconds: number;
  expired: boolean;
  progress: number;
};

export function getTimerState(input: TimerInput): TimerResult {
  const startAt = Number.isFinite(input.startAt) ? input.startAt : Date.now();
  const durationSeconds = Math.max(1, Math.floor(input.durationSeconds || 1));
  const now = Number.isFinite(input.now) ? input.now! : Date.now();

  const endsAt = startAt + durationSeconds * 1000;
  const remainingMs = Math.max(0, endsAt - now);
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const expired = now >= endsAt;

  const elapsedMs = Math.max(0, now - startAt);
  const totalMs = durationSeconds * 1000;
  const progress = Math.max(0, Math.min(1, Number((elapsedMs / totalMs).toFixed(4))));

  return {
    startAt,
    endsAt,
    now,
    remainingSeconds,
    expired,
    progress,
  };
}
