import type { MemoryKind, MemoryNode, MemoryVisibility } from "./types";

export function createMemoryNode(input: {
  id: string;
  ownerId: string;
  kind: MemoryKind;
  title: string;
  summary: string;
  visibility?: MemoryVisibility;
  emotionalWeight?: number;
  participantIds?: string[];
  sourcePortal?: MemoryNode["sourcePortal"];
}): MemoryNode {
  if (!input.id.trim()) throw new Error("memory_id_required");
  if (!input.ownerId.trim()) throw new Error("ownerId_required");
  if (!input.title.trim()) throw new Error("memory_title_required");

  return {
    id: input.id,
    ownerId: input.ownerId,
    kind: input.kind,
    title: input.title,
    summary: input.summary,
    createdAt: Date.now(),
    visibility: input.visibility ?? "private",
    emotionalWeight: Math.max(0, Math.min(100, input.emotionalWeight ?? 50)),
    participantIds: input.participantIds ?? [input.ownerId],
    sourcePortal: input.sourcePortal ?? "lumaspace",
  };
}

export function canViewMemory(memory: MemoryNode, viewerId: string, communityMember = false): boolean {
  if (memory.visibility === "public") return true;
  if (memory.ownerId === viewerId) return true;
  if (memory.visibility === "inner_circle" && memory.participantIds.includes(viewerId)) return true;
  if (memory.visibility === "community" && communityMember) return true;
  return false;
}

export function searchMemories(memories: MemoryNode[], query: string): MemoryNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return memories;

  return memories.filter((memory) =>
    `${memory.title} ${memory.summary} ${memory.kind}`.toLowerCase().includes(q),
  );
}
