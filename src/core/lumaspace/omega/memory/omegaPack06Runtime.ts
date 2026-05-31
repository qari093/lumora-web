import { createMemoryNode, canViewMemory, searchMemories } from "./memoryVault";
import { createTreeOfTime, attachMemoryToTree, createTreeBloom, attachBloomToTree } from "./treeOfTime";
import { createEchoChain, advanceEchoChain, createRemembranceBloom, restoreEchoChainByContribution, selectEchoOfYesterday } from "./echoOfYesterday";
import { createMemoryConstellation, addConstellationEcho, isConstellationActive } from "./memoryConstellation";
import { createMemoryReplay, createSharedReliveReplay } from "./memoryReplay";

export function runLumaSpaceOmegaMegaPack06Runtime() {
  const ownerId = "omega-citizen-006";

  const memoryA = createMemoryNode({
    id: "memory-first-light",
    ownerId,
    kind: "first_light",
    title: "First Light",
    summary: "The first time the Space opened.",
    emotionalWeight: 92,
    participantIds: [ownerId, "guide-001"],
    visibility: "inner_circle",
  });

  const memoryB = createMemoryNode({
    id: "memory-first-bridge",
    ownerId: "guide-001",
    kind: "bridge",
    title: "First Bridge",
    summary: "A bridge formed between two new citizens.",
    emotionalWeight: 88,
    participantIds: [ownerId, "guide-001"],
    visibility: "inner_circle",
  });

  let tree = createTreeOfTime(ownerId);
  tree = attachMemoryToTree(tree, memoryA);
  const bloom = createTreeBloom({
    id: "bloom-first-light",
    ownerId,
    sourceMemoryId: memoryA.id,
    bloomType: "first_memory",
    intensity: 90,
  });
  tree = attachBloomToTree(tree, bloom);

  let chain = createEchoChain(ownerId);
  for (let i = 0; i < 7; i += 1) chain = advanceEchoChain(chain);
  const remembrance = createRemembranceBloom(chain, memoryA.id);
  chain = restoreEchoChainByContribution(chain);

  let constellation = createMemoryConstellation({
    id: "constellation-first-bridge",
    memories: [memoryA, memoryB],
  });
  constellation = addConstellationEcho(constellation, "echo-001");

  const replay = createMemoryReplay(memoryA);
  const relive = createSharedReliveReplay(constellation);

  return {
    ok:
      canViewMemory(memoryA, "guide-001") &&
      searchMemories([memoryA, memoryB], "bridge").length === 1 &&
      tree.branches.some((branch) => branch.memoryIds.includes(memoryA.id)) &&
      tree.blooms.length === 1 &&
      chain.rewardBloomId === `remembrance_bloom_${ownerId}` &&
      remembrance?.bloomType === "remembrance" &&
      constellation.syncEnabled &&
      constellation.echoIds.includes("echo-001") &&
      isConstellationActive(constellation) &&
      replay.mode === "single" &&
      relive.mode === "shared_constellation",
    memoryA,
    memoryB,
    tree,
    chain,
    remembrance,
    constellation,
    replay,
    relive,
  };
}
