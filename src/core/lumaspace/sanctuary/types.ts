export interface SanctuaryTier {
  id: string;
  name: string;
}

export interface AuraEnhancement {
  id: string;
  effect: string;
}

export interface SanctuaryRuntime {
  active: boolean;
  tierId: string;
}
