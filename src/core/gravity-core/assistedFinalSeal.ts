export type GravityAssistedFinalSeal = {
  system: "Lumora Gravity Assisted Mode";
  status: "ASSISTED_MODE_INTEGRATED_DISABLED_SEALED";
  shadowModeActive: true;
  assistedModeIntegrated: true;
  assistedModeEnabled: false;
  navigationEnabled: false;
  activationRequiresTelemetry: true;
};

export function createGravityAssistedFinalSeal(): GravityAssistedFinalSeal {
  return {
    system: "Lumora Gravity Assisted Mode",
    status: "ASSISTED_MODE_INTEGRATED_DISABLED_SEALED",
    shadowModeActive: true,
    assistedModeIntegrated: true,
    assistedModeEnabled: false,
    navigationEnabled: false,
    activationRequiresTelemetry: true,
  };
}
