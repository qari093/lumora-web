export interface RenderProfile {
  id: string;
  tier: string;
}

export interface DeviceCapability {
  id: string;
  supportsAdaptive: boolean;
}

export interface PerformanceRuntime {
  active: boolean;
  renderProfileId: string;
}
