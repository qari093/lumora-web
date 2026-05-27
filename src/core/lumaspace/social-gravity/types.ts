export interface PresencePulse {
  id: string;
  aura: string;
}

export interface OrbitSignal {
  id: string;
  intensity: number;
}

export interface SocialGravityRuntime {
  active: boolean;
  orbitId: string;
}
