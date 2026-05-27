export interface SharedAtmosphere {
  id: string;
  resonance: string;
}

export interface PresenceState {
  id: string;
  users: number;
}

export interface RealtimeRuntime {
  active: boolean;
  roomId: string;
}
