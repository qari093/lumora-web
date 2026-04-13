import { getTimerState } from "./timerService";

type FeedItem = {
  id: string;
  kind: string;
  title?: string;
  text?: string;
  [key: string]: any;
};

type TimedFeedItem = FeedItem & {
  timer?: {
    startAt: number;
    endsAt: number;
    now: number;
    remainingSeconds: number;
    expired: boolean;
    progress: number;
  };
};

export function attachFeedTimers(
  feed: FeedItem[],
  opts?: {
    now?: number;
    durationSeconds?: number;
    everyN?: number;
  }
): TimedFeedItem[] {
  const now = Number.isFinite(opts?.now) ? Number(opts?.now) : Date.now();
  const durationSeconds = Math.max(15, Math.floor(opts?.durationSeconds ?? 300));
  const everyN = Math.max(1, Math.floor(opts?.everyN ?? 3));

  return (feed || []).map((item, index) => {
    const shouldAttach = ((index + 1) % everyN === 0) || item.kind === "sponsored";
    if (!shouldAttach) return item;

    const startAt = now - ((index % everyN) * 15000);
    const timer = getTimerState({
      startAt,
      durationSeconds,
      now,
    });

    return {
      ...item,
      timer,
    };
  });
}
