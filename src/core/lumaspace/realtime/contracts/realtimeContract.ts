import type {
  SharedAtmosphere,
  PresenceState,
  RealtimeRuntime
} from "../types";

export function validateSharedAtmosphere(
  atmosphere: SharedAtmosphere
): boolean {
  return Boolean(
    atmosphere.id &&
    atmosphere.resonance
  );
}

export function validatePresenceState(
  state: PresenceState
): boolean {
  return Boolean(
    state.id &&
    state.users >= 0
  );
}

export function validateRealtimeRuntime(
  runtime: RealtimeRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.roomId
  );
}
