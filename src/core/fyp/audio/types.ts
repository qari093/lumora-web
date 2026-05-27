export interface AudioAsset {
  id: string;
  src: string;
  durationMs: number;
  codec: string;
  normalized: boolean;
}

export interface AudioDecision {
  id: string;
  usable: boolean;
  reason: string;
  normalizeRequired: boolean;
}
