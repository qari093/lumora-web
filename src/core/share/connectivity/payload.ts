import type { ConnectivityChannel, ConnectivityPayload } from "./types";

export function createUniversalShareUrl(origin: string, shareId: string): string {
  return `${origin.replace(/\/+$/, "")}/share/${encodeURIComponent(shareId)}`;
}

export function createConnectivityPayload(params: {
  shareId: string;
  title: string;
  text?: string;
  url: string;
  channel: ConnectivityChannel;
  metadata?: Record<string, unknown>;
}): ConnectivityPayload {
  return {
    shareId: params.shareId,
    title: params.title,
    text: params.text ?? params.title,
    url: params.url,
    channel: params.channel,
    metadata: params.metadata ?? {},
  };
}
