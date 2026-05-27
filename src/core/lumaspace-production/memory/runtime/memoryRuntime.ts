import type { MemoryRuntime } from "../types";

export function runMemoryCivilizationRuntime(): MemoryRuntime {
  return {
    active: true,
    memories: [
      {
        id: "memory_001",
        ownerId: "user_001",
        atmosphere: "nostalgia",
        visibility: "private",
        createdAt: 1000
      }
    ]
  };
}
