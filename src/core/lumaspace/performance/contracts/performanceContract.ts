import type {
  RenderProfile,
  DeviceCapability,
  PerformanceRuntime
} from "../types";

export function validateRenderProfile(
  profile: RenderProfile
): boolean {
  return Boolean(
    profile.id &&
    profile.tier
  );
}

export function validateDeviceCapability(
  capability: DeviceCapability
): boolean {
  return Boolean(
    capability.id &&
    typeof capability.supportsAdaptive === "boolean"
  );
}

export function validatePerformanceRuntime(
  runtime: PerformanceRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.renderProfileId
  );
}
