export interface CosmosStar {
  id: string;
  resonance: string;
  y?: number;
  atmosphere?: string;
}

export interface CosmosCluster {
  id: string;
  stars: number;
}

export interface CosmosRuntime {
  active: boolean;
  clusterId: string;
}
