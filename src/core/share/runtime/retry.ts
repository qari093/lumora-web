import type { ShareQueueItem } from "./queue";

export function nextRetryDelayMs(retryCount: number): number {
  return Math.min(30000, 500 * 2 ** Math.max(0, retryCount));
}

export function markShareRetry(item: ShareQueueItem): ShareQueueItem {
  return {
    ...item,
    retryCount: item.retryCount + 1,
    share: {
      ...item.share,
      telemetry: {
        ...item.share.telemetry,
        attempts: item.share.telemetry.attempts + 1,
        lastAttemptAt: new Date().toISOString(),
      },
    },
  };
}
