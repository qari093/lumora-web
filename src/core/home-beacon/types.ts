export type HomeBeaconState = "idle" | "breathing" | "active" | "expanded" | "disabled";

export type HomeBeaconConfig = {
  enabled: boolean;
  breathingMs: number;
  position: "bottom-center";
  bladeCore: boolean;
  homeShell: boolean;
  portalReady: boolean;
};

export type HomeBeaconVisualState = {
  state: HomeBeaconState;
  pulseScale: number;
  glowOpacity: number;
  particleIntensity: number;
};
