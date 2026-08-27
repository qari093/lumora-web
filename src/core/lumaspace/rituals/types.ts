export interface EchoSeed {
  id: string;
  mood: string;
}

export interface MorningPortal {
  id: string;
  arrival: string;
}

export interface RitualRuntime {
  active: boolean;
  portalId: string;
}

export type AuraWeather = any;
