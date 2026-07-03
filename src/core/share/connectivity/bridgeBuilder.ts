import type { ConnectivityPayload } from "./types";
import type { ExternalBridgeAction, ExternalPlatform } from "./platformTypes";
import { getPlatformBridge } from "./platformRegistry";
import { sanitizeExternalPayload } from "./sanitizer";
import { createAndroidIntentLink, createIOSUniversalLink } from "./deepLinks";
import {
  formatEmailShare,
  formatSignalShare,
  formatSmsShare,
  formatTelegramShare,
  formatWhatsAppShare,
  formatExternalText,
} from "./formatters";

export function buildExternalBridgeAction(platform: ExternalPlatform, rawPayload: ConnectivityPayload): ExternalBridgeAction {
  const payload = sanitizeExternalPayload(rawPayload);
  const bridge = getPlatformBridge(platform);
  const privacyWarnings: string[] = [];

  if (platform === "sms") privacyWarnings.push("SMS may expose metadata to carriers.");
  if (platform === "email") privacyWarnings.push("Email may be forwarded outside Lumora controls.");

  const actionByPlatform: Record<ExternalPlatform, string> = {
    whatsapp: formatWhatsAppShare(payload),
    telegram: formatTelegramShare(payload),
    signal: formatSignalShare(payload),
    sms: formatSmsShare(payload),
    email: formatEmailShare(payload),
    airdrop: payload.url,
    nearby_share: payload.url,
    android_intent: createAndroidIntentLink({
      packageName: "app.lumora",
      fallbackUrl: payload.url,
      text: formatExternalText(payload),
    }),
    ios_universal_link: createIOSUniversalLink("https://lumora.app", payload.shareId),
    desktop_share: payload.url,
    browser_fallback: payload.url,
    clipboard: formatExternalText(payload),
    native_share: JSON.stringify({ title: payload.title, text: payload.text, url: payload.url }),
    qr: payload.url,
    web_embed: `<iframe src="${payload.url}" title="${payload.title}" loading="lazy"></iframe>`,
  };

  return {
    platform,
    channel: bridge.channel,
    label: bridge.label,
    action: actionByPlatform[platform],
    method: bridge.method,
    requiresGesture: bridge.requiresGesture,
    privacyWarnings,
    payload,
  };
}
