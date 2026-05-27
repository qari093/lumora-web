export interface OfflineState {
  enabled: boolean;
  queuedActions: number;
}

export interface RecoveryNode {
  id: string;
  restored: boolean;
}

export interface ResilienceRuntime {
  active: boolean;
  offline: OfflineState;
}
