export interface SafetyBoundary {
  id: string;
  category: string;
}

export interface ConsentLayer {
  id: string;
  required: boolean;
}

export interface GovernanceRuntime {
  active: boolean;
  boundaryId: string;
}
