import type { EchoChain, MemoryNode, TreeBloom } from "./types";
import { createTreeBloom } from "./treeOfTime";

export function selectEchoOfYesterday(memories: MemoryNode[], now = Date.now()): MemoryNode | null {
  if (memories.length === 0) return null;

  const oneDayMs = 24 * 60 * 60 * 1000;
  const candidates = memories
    .filter((memory) => memory.createdAt <= now - oneDayMs || memory.emotionalWeight >= 70)
    .sort((a, b) => b.emotionalWeight - a.emotionalWeight || b.createdAt - a.createdAt);

  return candidates[0] ?? memories[0] ?? null;
}

export function createEchoChain(ownerId: string): EchoChain {
  if (!ownerId.trim()) throw new Error("ownerId_required");

  return {
    ownerId,
    active: false,
    currentDays: 0,
    restoredByContribution: false,
  };
}

export function advanceEchoChain(chain: EchoChain): EchoChain {
  const nextDays = chain.currentDays + 1;

  return {
    ...chain,
    active: true,
    currentDays: nextDays,
    rewardBloomId: nextDays >= 7 ? `remembrance_bloom_${chain.ownerId}` : chain.rewardBloomId,
  };
}

export function restoreEchoChainByContribution(chain: EchoChain): EchoChain {
  return {
    ...chain,
    active: true,
    restoredByContribution: true,
    currentDays: Math.max(1, chain.currentDays),
  };
}

export function createRemembranceBloom(chain: EchoChain, memoryId: string): TreeBloom | null {
  if (!chain.rewardBloomId) return null;

  return createTreeBloom({
    id: chain.rewardBloomId,
    ownerId: chain.ownerId,
    sourceMemoryId: memoryId,
    bloomType: "remembrance",
    intensity: 88,
  });
}
