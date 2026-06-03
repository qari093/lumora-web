export const HOME_BEACON_INTERACTIONS = {
  resonance: true,
  reflection: true,
  ripple: true,
  echo: true,
  prism: true,
  growthCompass: true,
  discoveryBridge: true,
  identityBridge: true
};

export function interactionBridgeReady() {
  return Object.values(HOME_BEACON_INTERACTIONS).every(Boolean);
}
