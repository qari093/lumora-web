export interface RuntimeMatrixEntry {
  pack: number;
  name: string;
  passed: boolean;
  marker: string;
}

export interface RuntimeMatrixResult {
  ok: boolean;
  total: number;
  passed: number;
  failed: number;
  ready: boolean;
}
