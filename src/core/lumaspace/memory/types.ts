export interface MemoryFragment {
  id: string;
  atmosphere: string;
}

export interface MemoryFusion {
  id: string;
  merged: boolean;
}

export interface MemoryRuntime {
  active: boolean;
  vaultId: string;
}
