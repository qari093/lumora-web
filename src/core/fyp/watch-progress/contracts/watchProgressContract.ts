import type {
  WatchProgressEvent
} from "../types";

export function validateWatchProgressEvent(
  event: WatchProgressEvent
): boolean {
  return Boolean(
    event.itemId &&
      Number.isFinite(event.watchedMs) &&
      Number.isFinite(event.durationMs) &&
      event.watchedMs >= 0 &&
      event.durationMs > 0 &&
      event.watchedMs <= event.durationMs
  );
}
