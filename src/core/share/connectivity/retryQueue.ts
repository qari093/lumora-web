import type { ExternalBridgeAction } from "./platformTypes";

export type ExternalBridgeRetryItem = {
  id: string;
  action: ExternalBridgeAction;
  attempts: number;
  state: "queued" | "retrying" | "completed" | "failed";
};

export function enqueueExternalBridgeRetry(queue: ExternalBridgeRetryItem[], action: ExternalBridgeAction): ExternalBridgeRetryItem[] {
  const item: ExternalBridgeRetryItem = {
    id: `bridge_retry_${action.payload.shareId}_${action.platform}`,
    action,
    attempts: 0,
    state: "queued",
  };

  return [...queue.filter((entry) => entry.id !== item.id), item];
}

export function markExternalBridgeRetry(queue: ExternalBridgeRetryItem[], id: string, ok: boolean): ExternalBridgeRetryItem[] {
  return queue.map((item) =>
    item.id === id
      ? { ...item, attempts: item.attempts + 1, state: ok ? "completed" : item.attempts + 1 >= 3 ? "failed" : "retrying" }
      : item,
  );
}
