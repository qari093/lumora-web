import {
  buildExternalBridgeAction,
  createConnectivityPayload,
  createCompleteExternalBridgeManifest,
  detectPlatformEnvironment,
  selectPreferredPlatform,
  validateBridgeAction,
} from "@/src/core/share";

export type DeviceValidationTarget = {
  id: string;
  userAgent: string;
  expectedPlatform: "ios" | "android" | "macos" | "windows" | "linux" | "web";
  secureContext: boolean;
  hasNavigatorShare: boolean;
  hasClipboard: boolean;
  online: boolean;
};

export type DeviceValidationResult = {
  id: string;
  platform: string;
  preferredBridge: string;
  passed: boolean;
  checks: {
    id: string;
    passed: boolean;
    detail: string;
  }[];
};

export function createCanonicalDeviceTargets(): DeviceValidationTarget[] {
  return [
    {
      id: "iphone_pwa",
      userAgent: "Mozilla/5.0 iPhone Safari",
      expectedPlatform: "ios",
      secureContext: true,
      hasNavigatorShare: true,
      hasClipboard: true,
      online: true,
    },
    {
      id: "android_chrome",
      userAgent: "Mozilla/5.0 Android Chrome",
      expectedPlatform: "android",
      secureContext: true,
      hasNavigatorShare: true,
      hasClipboard: true,
      online: true,
    },
    {
      id: "mac_safari",
      userAgent: "Mozilla/5.0 Macintosh Safari",
      expectedPlatform: "macos",
      secureContext: true,
      hasNavigatorShare: false,
      hasClipboard: true,
      online: true,
    },
    {
      id: "windows_chrome",
      userAgent: "Mozilla/5.0 Windows Chrome",
      expectedPlatform: "windows",
      secureContext: true,
      hasNavigatorShare: false,
      hasClipboard: true,
      online: true,
    },
    {
      id: "offline_web",
      userAgent: "Mozilla/5.0 X11 Linux",
      expectedPlatform: "linux",
      secureContext: true,
      hasNavigatorShare: false,
      hasClipboard: true,
      online: false,
    },
  ];
}

export function validateDeviceShareTarget(target: DeviceValidationTarget): DeviceValidationResult {
  const env = detectPlatformEnvironment(target.userAgent, {
    secureContext: target.secureContext,
    hasNavigatorShare: target.hasNavigatorShare,
    hasClipboard: target.hasClipboard,
    online: target.online,
  });

  const preferredBridge = selectPreferredPlatform(env);
  const payload = createConnectivityPayload({
    shareId: `device_${target.id}`,
    title: "Device Validation Share",
    text: "Cross-platform USL validation.",
    url: `https://lumora.app/share/device_${target.id}`,
    channel: preferredBridge === "ios_universal_link" || preferredBridge === "airdrop" ? "airdrop" : preferredBridge === "android_intent" ? "nearby_share" : "web_embed",
    metadata: { deviceTarget: target.id },
  });

  const action = buildExternalBridgeAction(preferredBridge, payload);
  const validation = validateBridgeAction(action);
  const manifest = createCompleteExternalBridgeManifest({
    payload,
    platform: preferredBridge,
    environment: env,
    origin: "https://lumora.app",
  });

  const checks = [
    {
      id: "platform_detected",
      passed: env.platform === target.expectedPlatform,
      detail: env.platform,
    },
    {
      id: "bridge_selected",
      passed: Boolean(preferredBridge),
      detail: preferredBridge,
    },
    {
      id: "bridge_valid",
      passed: validation.ok,
      detail: validation.warnings.join(",") || "valid",
    },
    {
      id: "manifest_created",
      passed: manifest.version === "usl-external-bridges-v1",
      detail: manifest.version,
    },
    {
      id: "offline_safe",
      passed: target.online || preferredBridge === "clipboard" || preferredBridge === "browser_fallback",
      detail: target.online ? "online" : preferredBridge,
    },
  ];

  return {
    id: target.id,
    platform: env.platform,
    preferredBridge,
    checks,
    passed: checks.every((check) => check.passed),
  };
}

export function summarizeDeviceValidation(results: DeviceValidationResult[]) {
  const total = results.length;
  const passed = results.filter((result) => result.passed).length;
  const checks = results.flatMap((result) => result.checks);
  const checkPassed = checks.filter((check) => check.passed).length;

  return {
    total,
    passed,
    checkTotal: checks.length,
    checkPassed,
    score: Number((checkPassed / Math.max(1, checks.length)).toFixed(4)),
    ready: total > 0 && passed === total && checkPassed === checks.length,
  };
}
