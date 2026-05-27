export interface SecuritySeal {
  id: string;
  hardened: boolean;
}

export interface MonitoringSignal {
  id: string;
  latencyMs: number;
}

export interface DeploymentRuntime {
  active: boolean;
  region: string;
}
