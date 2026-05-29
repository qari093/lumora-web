export type RealtimePresence = {
  id: string;
  userId: string;
  active: boolean;
};

export type SharedAtmosphere = {
  id: string;
  participants: number;
  resonance: string;
};

export type PresenceState = {
  id: string;
  active: boolean;
  participants: number;
};

export type RealtimeRuntime = {
  active: boolean;
  presence: RealtimePresence;
  sharedAtmosphere: SharedAtmosphere;
  presenceState: PresenceState;
};

export function createRealtimePresence(): RealtimePresence {
  return {
    id: "presence_001",
    userId: "user_001",
    active: true
  };
}

export function validateRealtimePresence(value: unknown): value is RealtimePresence {
  const v = value as Partial<RealtimePresence>;
  return !!v && typeof v.id === "string" && typeof v.userId === "string" && v.active === true;
}

export function createSharedAtmosphere(): SharedAtmosphere {
  return {
    id: "shared_atmosphere_001",
    participants: 2,
    resonance: "echo-light"
  };
}

export function validateSharedAtmosphere(value: unknown): value is SharedAtmosphere {
  const v = value as Partial<SharedAtmosphere>;
  return !!v && typeof v.resonance === "string" && v.resonance.length > 0;
}

export function createPresenceState(): PresenceState {
  return {
    id: "presence_state_001",
    active: true,
    participants: 2
  };
}

export function validatePresenceState(value: unknown): value is PresenceState {
  const v = value as Partial<PresenceState>;
  return !!v && typeof v.id === "string" && v.active === true && typeof v.participants === "number";
}

export function runRealtimeRuntime(): RealtimeRuntime {
  return {
    active: true,
    presence: createRealtimePresence(),
    sharedAtmosphere: createSharedAtmosphere(),
    presenceState: createPresenceState()
  };
}

export function validateRealtimeRuntime(value: unknown): value is RealtimeRuntime {
  const v = value as Partial<RealtimeRuntime>;
  return !!v && v.active === true && validateRealtimePresence(v.presence) && validateSharedAtmosphere(v.sharedAtmosphere);
}
