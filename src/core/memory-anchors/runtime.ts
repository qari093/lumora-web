export interface MemoryAnchorRuntime {
  id: string;
  creatorId: string;
  sourceId: string;
  timestampMs: number;
  label?: string;
}

export function createMemoryAnchor(anchor: MemoryAnchorRuntime) {
  return anchor;
}
