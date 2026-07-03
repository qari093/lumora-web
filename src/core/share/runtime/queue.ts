import type { UniversalShareObject } from "../foundation/types";
import { transitionShare } from "./lifecycle";

export type ShareQueuePriority = "low" | "normal" | "high";

export type ShareQueueItem = {
  share: UniversalShareObject;
  queuedAt: string;
  priority: ShareQueuePriority;
  retryCount: number;
};

export function enqueueShare(
  share: UniversalShareObject,
  priority: ShareQueuePriority = "normal",
): ShareQueueItem {
  const validated = share.lifecycle === "validated" ? share : transitionShare(share, "validated");

  return {
    share: transitionShare(validated, "queued"),
    queuedAt: new Date().toISOString(),
    priority,
    retryCount: 0,
  };
}
