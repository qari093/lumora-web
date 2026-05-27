import type {
  WatchProgressEvent,
  WatchProgressResult
} from "../types";

import {
  validateWatchProgressEvent
} from "../contracts/watchProgressContract";

export function trackWatchProgress(
  event: WatchProgressEvent
): WatchProgressResult {
  if (!validateWatchProgressEvent(event)) {
    throw new Error("invalid_watch_progress_event");
  }

  const percent =
    Math.round(
      (event.watchedMs / event.durationMs) * 100
    );

  let milestone = "started";

  if (percent >= 95) {
    milestone = "completed";
  } else if (percent >= 50) {
    milestone = "engaged";
  }

  return {
    itemId: event.itemId,
    percent,
    completed: percent >= 95,
    milestone
  };
}
