export function createReturnToLumoraUrl(origin: string, shareId: string, status: "sent" | "cancelled" | "failed"): string {
  const url = new URL(`${origin.replace(/\/+$/, "")}/share/return`);
  url.searchParams.set("shareId", shareId);
  url.searchParams.set("status", status);
  return url.toString();
}

export function parseReturnToLumoraUrl(value: string) {
  const url = new URL(value);
  return {
    shareId: url.searchParams.get("shareId") ?? "",
    status: url.searchParams.get("status") ?? "unknown",
  };
}

export function createFailedExternalShareRecovery(shareId: string, channel: string) {
  return {
    id: `external_recovery_${shareId}_${channel}`,
    shareId,
    channel,
    action: "retry_or_copy_link",
    message: "External share did not complete. Retry or copy the Lumora link.",
  };
}
