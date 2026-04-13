export type DeviceNSFWHookConfig = {
  platform: "ios" | "android" | "web" | "unknown";
  enabled: boolean;
  mode: "hook_only" | "local_scan" | "disabled";
  threshold: number;
  providerHint: string;
};

export type DeviceNSFWProbeResult = {
  ok: boolean;
  config: DeviceNSFWHookConfig;
  supported: boolean;
  reason: string;
};

export function getDeviceNSFWHookConfig(userAgent?: string): DeviceNSFWHookConfig {
  const ua = String(userAgent || "").toLowerCase();

  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) {
    return {
      platform: "ios",
      enabled: true,
      mode: "hook_only",
      threshold: 0.7,
      providerHint: "apple_vision_hook",
    };
  }

  if (ua.includes("android")) {
    return {
      platform: "android",
      enabled: true,
      mode: "hook_only",
      threshold: 0.7,
      providerHint: "mlkit_hook",
    };
  }

  if (ua.includes("mozilla") || ua.includes("chrome") || ua.includes("safari")) {
    return {
      platform: "web",
      enabled: false,
      mode: "disabled",
      threshold: 0.7,
      providerHint: "no_local_scanner",
    };
  }

  return {
    platform: "unknown",
    enabled: false,
    mode: "disabled",
    threshold: 0.7,
    providerHint: "unknown_platform",
  };
}

export function probeDeviceNSFWHooks(userAgent?: string): DeviceNSFWProbeResult {
  const config = getDeviceNSFWHookConfig(userAgent);

  if (!config.enabled) {
    return {
      ok: true,
      config,
      supported: false,
      reason: "device_nsfw_hook_not_available_for_platform",
    };
  }

  return {
    ok: true,
    config,
    supported: true,
    reason: "device_nsfw_hook_ready_for_client_integration",
  };
}
