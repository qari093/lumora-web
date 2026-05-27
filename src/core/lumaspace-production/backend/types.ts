export interface ApiSurface {
  route: string;
  secured: boolean;
}

export interface QueueJob {
  id: string;
  type: string;
  retries: number;
}

export interface BackendRuntime {
  active: boolean;
  routes: ApiSurface[];
}
