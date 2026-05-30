
export function createRenderProfile(fpsTarget = 60) {
  return { id: "render_profile_001", fpsTarget, quality: "adaptive", active: true };
}
export function validateRenderProfile(v: any) { return !!v && typeof v.fpsTarget === "number"; }
export function createDeviceCapability(tier = "standard") {
  return { id: "device_capability_001", tier, webgl: true, active: true };
}
export function validateDeviceCapability(v: any) { return !!v && v.active === true; }
export function runPerformanceRuntime() {
  return { id: "performance_runtime_001", active: true, profile: createRenderProfile(60), device: createDeviceCapability() };
}
export function validatePerformanceRuntime(v: any) {
  return !!v && v.active === true && !!v.profile && v.profile.fpsTarget === 60;
}

