import type { GravityAssistedDecision } from "./assistedTypes";

export type GravityPortalRevealState = {
  integrated: boolean;
  enabled: boolean;
  revealPortalRing: boolean;
  showReturnAffordance: boolean;
  revealOpacity: number;
  revealScale: number;
  label: "none" | "return_home" | "portal_preview";
  navigationEnabled: false;
};

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function computeAssistedPortalReveal(decision: GravityAssistedDecision): GravityPortalRevealState {
  if (!decision.enabled) {
    return {
      integrated: true,
      enabled: false,
      revealPortalRing: false,
      showReturnAffordance: false,
      revealOpacity: 0,
      revealScale: 0.82,
      label: "none",
      navigationEnabled: false,
    };
  }

  const canReveal = decision.canRevealPortal && decision.stage !== "blocked";
  const opacity = canReveal ? clamp01(0.22 + decision.confidence * 0.72) : 0;
  const scale = canReveal ? clamp01(0.88 + decision.confidence * 0.18) : 0.82;

  return {
    integrated: true,
    enabled: true,
    revealPortalRing: canReveal,
    showReturnAffordance: decision.canSuggestReturn && canReveal,
    revealOpacity: opacity,
    revealScale: scale,
    label: decision.canSuggestReturn && canReveal ? "return_home" : canReveal ? "portal_preview" : "none",
    navigationEnabled: false,
  };
}
