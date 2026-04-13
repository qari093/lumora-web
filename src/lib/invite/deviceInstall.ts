export type DeviceInstallHints = {
  primaryCta: string;
  installHint: string;
  platform: "ios" | "android" | "desktop" | "unknown";
};

export function getDeviceInstallHints(userAgent?: string): DeviceInstallHints {
  const ua = (userAgent ?? "").toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) {
    return {
      platform: "ios",
      primaryCta: "Open Lumora",
      installHint: "On iPhone: tap Share, then Add to Home Screen.",
    };
  }

  if (/android/.test(ua)) {
    return {
      platform: "android",
      primaryCta: "Open Lumora",
      installHint: "On Android/Chrome: tap Install App when prompted.",
    };
  }

  if (/macintosh|windows|linux/.test(ua)) {
    return {
      platform: "desktop",
      primaryCta: "Open Lumora",
      installHint: "Open Lumora in your browser. Mobile install prompts appear on phone devices.",
    };
  }

  return {
    platform: "unknown",
    primaryCta: "Open Lumora",
    installHint: "Open Lumora and install it from your browser options if available.",
  };
}
