import type { ExternalPlatform, PlatformEnvironment } from "./platformTypes";

export function detectPlatformEnvironment(userAgent: string, overrides: Partial<PlatformEnvironment> = {}): PlatformEnvironment {
  const ua = userAgent.toLowerCase();
  const platform =
    /iphone|ipad|ios/.test(ua) ? "ios" :
    /android/.test(ua) ? "android" :
    /mac/.test(ua) ? "macos" :
    /win/.test(ua) ? "windows" :
    /linux/.test(ua) ? "linux" :
    "web";

  return {
    userAgent,
    platform,
    secureContext: overrides.secureContext ?? true,
    hasNavigatorShare: overrides.hasNavigatorShare ?? false,
    hasClipboard: overrides.hasClipboard ?? true,
    online: overrides.online ?? true,
  };
}

export function selectPreferredPlatform(env: PlatformEnvironment): ExternalPlatform {
  if (env.hasNavigatorShare && env.secureContext) return "native_share";
  if (env.platform === "ios") return "ios_universal_link";
  if (env.platform === "android") return "android_intent";
  if (env.platform === "macos") return "airdrop";
  if (env.hasClipboard) return "clipboard";
  return "browser_fallback";
}
