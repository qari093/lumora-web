import { describe, expect, it } from "vitest";
import { validateMemoryRuntime, validateMemoryIndexEntry } from "@/src/core/lumaspace-production/memory/contracts/memoryContract";
import { canAccessMemory } from "@/src/core/lumaspace-production/memory/privacy/memoryPrivacy";
import { indexMemory } from "@/src/core/lumaspace-production/memory/indexing/memoryIndexer";
import { runMemoryCivilizationRuntime } from "@/src/core/lumaspace-production/memory/runtime/memoryRuntime";

describe("LumaSpace Production Pack 03 Memory Civilization", () => {
  it("runs valid memory runtime", () => {
    expect(validateMemoryRuntime(runMemoryCivilizationRuntime())).toBe(true);
  });

  it("indexes memory", () => {
    const memory = runMemoryCivilizationRuntime().memories[0];
    expect(validateMemoryIndexEntry(indexMemory(memory))).toBe(true);
  });

  it("protects private memory", () => {
    const memory = runMemoryCivilizationRuntime().memories[0];
    expect(canAccessMemory(memory, "user_001")).toBe(true);
    expect(canAccessMemory(memory, "user_002")).toBe(false);
  });
});
