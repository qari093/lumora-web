export interface SecuritySeal {
  id: string;
  layer: string;
}

export interface RecoveryNode {
  id: string;
  standby: boolean;
}

export interface DeploymentRuntime {
  active: boolean;
  sealId: string;
}
