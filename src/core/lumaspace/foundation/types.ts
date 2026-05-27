export interface FoundationState {
  id: string;
  status: string;
  atmosphere: string;
}

export interface IdentityState {
  id: string;
  aura: string;
}

export interface RuntimeSeal {
  active: boolean;
  version: string;
}
