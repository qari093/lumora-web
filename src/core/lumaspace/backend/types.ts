export interface CivilizationSurface {
  id: string;
  route: string;
}

export interface RuntimeBridge {
  id: string;
  connected: boolean;
}

export interface BackendRuntime {
  active: boolean;
  bridgeId: string;
}
