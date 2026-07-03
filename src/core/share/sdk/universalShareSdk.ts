import { createUniversalShareObject, type CreateShareInput } from "../foundation/createShare";
import type { UniversalShareObject } from "../foundation/types";
import { enqueueShare, type ShareQueueItem, type ShareQueuePriority } from "../runtime/queue";
import { rollbackShare } from "../runtime/rollback";
import { transitionShare } from "../runtime/lifecycle";
import { createShareTelemetryEvent } from "../telemetry/events";
import { publishShareEvent } from "../runtime/eventBus";

export function createShare(input: CreateShareInput): UniversalShareObject {
  const share = createUniversalShareObject(input);
  publishShareEvent(createShareTelemetryEvent("share_created", share));
  return share;
}

export function queueShare(
  share: UniversalShareObject,
  priority: ShareQueuePriority = "normal",
): ShareQueueItem {
  const item = enqueueShare(share, priority);
  publishShareEvent(createShareTelemetryEvent("share_queued", item.share));
  return item;
}

export function deliverShare(share: UniversalShareObject): UniversalShareObject {
  const delivering = share.lifecycle === "delivering" ? share : transitionShare(share, "delivering");
  publishShareEvent(createShareTelemetryEvent("share_delivering", delivering));

  const delivered = transitionShare(delivering, "delivered");
  publishShareEvent(createShareTelemetryEvent("share_delivered", delivered));

  return delivered;
}

export function cancelShare(share: UniversalShareObject): UniversalShareObject {
  const revoked = transitionShare(share, "revoked");
  publishShareEvent(createShareTelemetryEvent("share_revoked", revoked));
  return revoked;
}

export function restoreFailedShare(share: UniversalShareObject, reason: string): UniversalShareObject {
  const rolledBack = rollbackShare(share, reason);
  publishShareEvent(createShareTelemetryEvent("share_rolled_back", rolledBack));
  return rolledBack;
}
