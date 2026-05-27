export interface ClientFeedRequest {
  sessionId: string;
  viewport: "mobile" | "desktop";
  preload: boolean;
}

export interface ClientBridgePayload {
  ok: true;
  sessionId: string;
  viewport: string;
  preload: boolean;
  hydrated: boolean;
}
