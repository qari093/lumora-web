export interface Constellation {
  id: string;
  members: number;
}

export interface AuraBloom {
  id: string;
  atmosphere: string;
}

export interface ConstellationRuntime {
  active: boolean;
  constellationId: string;
}
