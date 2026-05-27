export interface MemoryRecord {
  id: string;
  ownerId: string;
  atmosphere: string;
  visibility: "private" | "shared";
  createdAt: number;
}

export interface MemoryIndexEntry {
  id: string;
  memoryId: string;
  tags: string[];
}

export interface MemoryRuntime {
  active: boolean;
  memories: MemoryRecord[];
}
