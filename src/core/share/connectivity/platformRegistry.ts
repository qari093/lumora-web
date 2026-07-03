import type { ConnectivityChannel } from "./types";
import type { ExternalPlatform } from "./platformTypes";

export type PlatformBridgeDefinition = {
  platform: ExternalPlatform;
  channel: ConnectivityChannel;
  label: string;
  method: "url" | "native" | "clipboard" | "embed" | "qr" | "intent";
  supportsReturnToLumora: boolean;
  supportsDeferredDeepLink: boolean;
  requiresGesture: boolean;
};

export const platformBridgeRegistry: PlatformBridgeDefinition[] = [
  { platform: "whatsapp", channel: "whatsapp", label: "WhatsApp", method: "url", supportsReturnToLumora: false, supportsDeferredDeepLink: true, requiresGesture: true },
  { platform: "telegram", channel: "telegram", label: "Telegram", method: "url", supportsReturnToLumora: false, supportsDeferredDeepLink: true, requiresGesture: true },
  { platform: "signal", channel: "signal", label: "Signal", method: "url", supportsReturnToLumora: false, supportsDeferredDeepLink: true, requiresGesture: true },
  { platform: "sms", channel: "sms", label: "SMS", method: "url", supportsReturnToLumora: false, supportsDeferredDeepLink: false, requiresGesture: true },
  { platform: "email", channel: "email", label: "Email", method: "url", supportsReturnToLumora: true, supportsDeferredDeepLink: true, requiresGesture: true },
  { platform: "airdrop", channel: "airdrop", label: "AirDrop", method: "native", supportsReturnToLumora: true, supportsDeferredDeepLink: true, requiresGesture: true },
  { platform: "nearby_share", channel: "nearby_share", label: "Nearby Share", method: "native", supportsReturnToLumora: true, supportsDeferredDeepLink: true, requiresGesture: true },
  { platform: "android_intent", channel: "nearby_share", label: "Android Intent", method: "intent", supportsReturnToLumora: true, supportsDeferredDeepLink: true, requiresGesture: true },
  { platform: "ios_universal_link", channel: "airdrop", label: "iOS Universal Link", method: "url", supportsReturnToLumora: true, supportsDeferredDeepLink: true, requiresGesture: false },
  { platform: "desktop_share", channel: "web_embed", label: "Desktop Share", method: "native", supportsReturnToLumora: true, supportsDeferredDeepLink: true, requiresGesture: true },
  { platform: "browser_fallback", channel: "web_embed", label: "Browser Fallback", method: "url", supportsReturnToLumora: true, supportsDeferredDeepLink: true, requiresGesture: false },
  { platform: "clipboard", channel: "web_embed", label: "Clipboard", method: "clipboard", supportsReturnToLumora: true, supportsDeferredDeepLink: true, requiresGesture: false },
  { platform: "native_share", channel: "web_embed", label: "Native Share", method: "native", supportsReturnToLumora: true, supportsDeferredDeepLink: true, requiresGesture: true },
  { platform: "qr", channel: "qr", label: "QR", method: "qr", supportsReturnToLumora: true, supportsDeferredDeepLink: true, requiresGesture: false },
  { platform: "web_embed", channel: "web_embed", label: "Web Embed", method: "embed", supportsReturnToLumora: true, supportsDeferredDeepLink: true, requiresGesture: false },
];

export function getPlatformBridge(platform: ExternalPlatform): PlatformBridgeDefinition {
  const bridge = platformBridgeRegistry.find((item) => item.platform === platform);
  if (!bridge) throw new Error(`platform_bridge_missing:${platform}`);
  return bridge;
}

export function listPlatformBridges(): PlatformBridgeDefinition[] {
  return [...platformBridgeRegistry];
}
