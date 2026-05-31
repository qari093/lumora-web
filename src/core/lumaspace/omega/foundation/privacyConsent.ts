export type ConsentScope =
  | "living_card"
  | "video_profile"
  | "bridge_matching"
  | "local_orbit"
  | "memory_chronicle"
  | "wisdom_beacons";

export type ConsentState = Record<ConsentScope, boolean>;

export const DEFAULT_LUMASPACE_CONSENT: ConsentState = {
  living_card: true,
  video_profile: false,
  bridge_matching: false,
  local_orbit: false,
  memory_chronicle: false,
  wisdom_beacons: false,
};

export function enableConsent(scope: ConsentScope, state: ConsentState = DEFAULT_LUMASPACE_CONSENT): ConsentState {
  return { ...state, [scope]: true };
}

export function disableConsent(scope: ConsentScope, state: ConsentState = DEFAULT_LUMASPACE_CONSENT): ConsentState {
  return { ...state, [scope]: false };
}

export function canUseBridgeMatching(state: ConsentState): boolean {
  return state.bridge_matching === true;
}

export function canUseLocalOrbit(state: ConsentState): boolean {
  return state.local_orbit === true && state.bridge_matching === true;
}
