export type LumoraFlagKey =
  | "lumoraV75Enabled"
  | "signalEngineEnabled"
  | "intelligenceEngineEnabled"
  | "trustEngineEnabled"
  | "hygieneLayerEnabled"
  | "formatEngineEnabled"
  | "motionEngineEnabled"
  | "videoPerceptionEnabled"
  | "reactionEchoEnabled"
  | "personalizationEnabled"
  | "fypEngineEnabled"
  | "socialEngineEnabled"
  | "fomoEngineEnabled"
  | "interactionEngineEnabled"
  | "culturalEngineEnabled"
  | "cineverseEnabled"
  | "contentSupplyEnabled"
  | "feedbackEngineEnabled"
  | "ethicalLayerEnabled"
  | "monetizationHooksEnabled";

export type LumoraFlags = Record<LumoraFlagKey, boolean>;

export const DEFAULT_LUMORA_FLAGS: LumoraFlags = {
  lumoraV75Enabled: true,
  signalEngineEnabled: true,
  intelligenceEngineEnabled: true,
  trustEngineEnabled: true,
  hygieneLayerEnabled: true,
  formatEngineEnabled: true,
  motionEngineEnabled: true,
  videoPerceptionEnabled: true,
  reactionEchoEnabled: true,
  personalizationEnabled: true,
  fypEngineEnabled: true,
  socialEngineEnabled: true,
  fomoEngineEnabled: true,
  interactionEngineEnabled: true,
  culturalEngineEnabled: true,
  cineverseEnabled: true,
  contentSupplyEnabled: true,
  feedbackEngineEnabled: true,
  ethicalLayerEnabled: true,
  monetizationHooksEnabled: false,
};
