export interface PresenceSession {
  id: string;
  userId: string;
  status: "ambient" | "active" | "quiet";
}

export interface SyncEvent {
  id: string;
  type: string;
  payloadVersion: number;
}

export interface RealtimeRuntime {
  active: boolean;
  sessions: PresenceSession[];
}
