import type {
  WatchProgressEvent,
  WatchProgressResult
} from "../types";

import {
  trackWatchProgress
} from "./watchProgressTracker";

export function runWatchProgressRuntime(
  events: WatchProgressEvent[]
): WatchProgressResult[] {
  return events.map(trackWatchProgress);
}
