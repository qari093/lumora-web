export interface IntegrationSurface {
  id: string;
  route: string;
  enabled: boolean;
}

export interface RuntimeBridge {
  id: string;
  target: string;
}

export interface IntegrationRuntime {
  active: boolean;
  surface: IntegrationSurface;
}
