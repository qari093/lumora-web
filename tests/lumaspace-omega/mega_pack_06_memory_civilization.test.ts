import { describe, expect, it } from "vitest";
import { createMemoryNode, canViewMemory, searchMemories } from "@/src/core/lumaspace/omega/memory/memoryVault";
import { createTreeOfTime, attachMemoryToTree, createTreeBloom, attachBloomToTree } from "@/src/core/lumaspace/omega/memory/treeOfTime";
import { advanceEchoChain, createEchoChain, createRemembranceBloom, restoreEchoChainByContribution, selectEchoOfYesterday } from "@/src/core/lumaspace/omega/memory/echoOfYesterday";
import { addConstellationEcho, createMemoryConstellation, isConstellationActive } from "@/src/core/lumaspace/omega/memory/memoryConstellation";
import { createMemoryReplay, createSharedReliveReplay } from "@/src/core/lumaspace/omega/memory/memoryReplay";
import { runLumaSpaceOmegaMegaPack06Runtime } from "@/src/core/lumaspace/omega/memory/omegaPack06Runtime";

describe("LumaSpace Ω∞ Mega Pack 06 — Memory Civilization + Tree of Time + Echo Chain", () => {
  it("creates memory node and privacy rules", () => {
    const memory = createMemoryNode({
      id: "m1",
      ownerId: "u1",
      kind: "bridge",
      title: "First Bridge",
      summary: "A shared beginning",
      visibility: "inner_circle",
      participantIds: ["u1", "u2"],
    });

    expect(canViewMemory(memory, "u1")).toBe(true);
    expect(canViewMemory(memory, "u2")).toBe(true);
    expect(canViewMemory(memory, "u3")).toBe(false);
  });

  it("searches memory vault", () => {
    const memories = [
      createMemoryNode({ id: "m1", ownerId: "u1", kind: "mission", title: "Crystal Mission", summary: "Done" }),
      createMemoryNode({ id: "m2", ownerId: "u1", kind: "wisdom", title: "Quiet Lesson", summary: "Learned" }),
    ];

    expect(searchMemories(memories, "crystal")).toHaveLength(1);
  });

  it("builds tree of time with bloom", () => {
    const memory = createMemoryNode({ id: "m3", ownerId: "u1", kind: "mission", title: "Mission", summary: "Progress" });
    let tree = createTreeOfTime("u1");
    tree = attachMemoryToTree(tree, memory);

    const bloom = createTreeBloom({
      id: "b1",
      ownerId: "u1",
      sourceMemoryId: "m3",
      bloomType: "mission",
    });

    tree = attachBloomToTree(tree, bloom);

    expect(tree.blooms).toHaveLength(1);
    expect(tree.branches.some((branch) => branch.bloomIds.includes("b1"))).toBe(true);
  });

  it("runs echo chain and restoration loop", () => {
    let chain = createEchoChain("u1");
    for (let i = 0; i < 7; i += 1) chain = advanceEchoChain(chain);

    const bloom = createRemembranceBloom(chain, "m1");
    const restored = restoreEchoChainByContribution(chain);

    expect(chain.rewardBloomId).toBe("remembrance_bloom_u1");
    expect(bloom?.bloomType).toBe("remembrance");
    expect(restored.restoredByContribution).toBe(true);
  });

  it("selects echo of yesterday", () => {
    const memory = createMemoryNode({
      id: "m4",
      ownerId: "u1",
      kind: "celebration",
      title: "High Emotion",
      summary: "Important",
      emotionalWeight: 90,
    });

    expect(selectEchoOfYesterday([memory])?.id).toBe("m4");
  });

  it("creates memory constellation sync", () => {
    const a = createMemoryNode({ id: "a", ownerId: "u1", kind: "bridge", title: "A", summary: "A", participantIds: ["u1", "u2"] });
    const b = createMemoryNode({ id: "b", ownerId: "u2", kind: "bridge", title: "B", summary: "B", participantIds: ["u1", "u2"] });

    let constellation = createMemoryConstellation({ id: "mc1", memories: [a, b] });
    constellation = addConstellationEcho(constellation, "echo1");

    expect(constellation.syncEnabled).toBe(true);
    expect(constellation.participantIds).toContain("u1");
    expect(constellation.echoIds).toContain("echo1");
    expect(isConstellationActive(constellation)).toBe(true);
  });

  it("creates memory replay and shared relive", () => {
    const memory = createMemoryNode({ id: "m5", ownerId: "u1", kind: "first_light", title: "First", summary: "Light", emotionalWeight: 80 });
    const replay = createMemoryReplay(memory);

    const other = createMemoryNode({ id: "m6", ownerId: "u2", kind: "first_light", title: "Other", summary: "Light", participantIds: ["u1", "u2"] });
    const constellation = createMemoryConstellation({ id: "mc2", memories: [memory, other] });
    const relive = createSharedReliveReplay(constellation);

    expect(replay.mode).toBe("single");
    expect(relive.mode).toBe("shared_constellation");
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack06Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.tree.blooms).toHaveLength(1);
    expect(runtime.chain.restoredByContribution).toBe(true);
    expect(runtime.constellation.syncEnabled).toBe(true);
  });
});
