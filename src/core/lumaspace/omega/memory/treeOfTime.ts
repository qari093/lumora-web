import type { MemoryNode, TreeBloom, TreeOfTime } from "./types";

export function createTreeOfTime(ownerId: string): TreeOfTime {
  if (!ownerId.trim()) throw new Error("ownerId_required");

  return {
    ownerId,
    branches: [
      { id: "identity", label: "Identity", memoryIds: [], bloomIds: [] },
      { id: "community", label: "Community", memoryIds: [], bloomIds: [] },
      { id: "contribution", label: "Contribution", memoryIds: [], bloomIds: [] },
      { id: "legacy", label: "Legacy", memoryIds: [], bloomIds: [] },
    ],
    blooms: [],
  };
}

export function createTreeBloom(input: {
  id: string;
  ownerId: string;
  sourceMemoryId: string;
  bloomType: TreeBloom["bloomType"];
  intensity?: number;
}): TreeBloom {
  const colorByType: Record<TreeBloom["bloomType"], string> = {
    first_memory: "pearl_gold",
    gratitude: "warm_gold",
    remembrance: "soft_blue",
    mission: "crystal_violet",
    bridge: "starlight_silver",
    wisdom: "lamp_amber",
    legacy: "deep_aurora",
  };

  return {
    id: input.id,
    ownerId: input.ownerId,
    sourceMemoryId: input.sourceMemoryId,
    bloomType: input.bloomType,
    color: colorByType[input.bloomType],
    intensity: Math.max(1, Math.min(100, input.intensity ?? 50)),
  };
}

export function attachMemoryToTree(tree: TreeOfTime, memory: MemoryNode): TreeOfTime {
  const branchId =
    memory.kind === "bridge" ? "community" :
    memory.kind === "mission" || memory.kind === "wisdom" ? "contribution" :
    memory.kind === "chronicle" ? "legacy" :
    "identity";

  return {
    ...tree,
    branches: tree.branches.map((branch) =>
      branch.id === branchId
        ? { ...branch, memoryIds: Array.from(new Set([...branch.memoryIds, memory.id])) }
        : branch,
    ),
  };
}

export function attachBloomToTree(tree: TreeOfTime, bloom: TreeBloom): TreeOfTime {
  return {
    ...tree,
    blooms: [...tree.blooms, bloom],
    branches: tree.branches.map((branch) =>
      branch.memoryIds.includes(bloom.sourceMemoryId)
        ? { ...branch, bloomIds: Array.from(new Set([...branch.bloomIds, bloom.id])) }
        : branch,
    ),
  };
}
