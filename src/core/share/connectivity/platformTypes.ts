import type { ConnectivityChannel, ConnectivityPayload } from "./types";

export type ExternalPlatform =
  | "whatsapp"
  | "telegram"
  | "signal"
  | "sms"
  | "email"
  | "airdrop"
  | "nearby_share"
  | "android_intent"
  | "ios_universal_link"
  | "desktop_share"
  | "browser_fallback"
  | "clipboard"
  | "native_share"
  | "qr"
  | "web_embed";

export type PlatformEnvironment = {
  userAgent: string;
  platform: "ios" | "android" | "macos" | "windows" | "linux" | "web";
  secureContext: boolean;
  hasNavigatorShare: boolean;
  hasClipboard: boolean;
  online: boolean;
};

export type ExternalBridgeAction = {
  platform: ExternalPlatform;
  channel: ConnectivityChannel;
  label: string;
  action: string;
  method: "url" | "native" | "clipboard" | "embed" | "qr" | "intent";
  requiresGesture: boolean;
  privacyWarnings: string[];
  payload: ConnectivityPayload;
};
