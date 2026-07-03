import type { ConnectivityPayload } from "./types";

export function sanitizeExternalText(value: string, max = 500): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function stripPrivateMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const blocked = new Set(["email", "phone", "ip", "preciseLocation", "deviceId", "sessionId", "token", "secret"]);
  return Object.fromEntries(Object.entries(metadata).filter(([key]) => !blocked.has(key)));
}

export function sanitizeExternalPayload(payload: ConnectivityPayload): ConnectivityPayload {
  return {
    ...payload,
    title: sanitizeExternalText(payload.title, 120),
    text: sanitizeExternalText(payload.text, 500),
    url: payload.url.trim(),
    metadata: stripPrivateMetadata(payload.metadata),
  };
}
