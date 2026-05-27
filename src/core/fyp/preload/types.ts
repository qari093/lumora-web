export interface PreloadCandidate {
  id: string;
  src: string;
  priority: number;
  estimatedBytes: number;
}

export interface PreloadDecision {
  id: string;
  preload: boolean;
  reason: string;
}
