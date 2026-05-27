import { describe, expect, it } from "vitest";
import { createPresenceLight } from "@/src/core/celebrations/constellations/presenceConstellations";
import { createMemoryRiver } from "@/src/core/celebrations/memory/memoryRivers";

describe("Celebrations Mega Pack 03", () => {
  it("creates presence light", () => {
    expect(createPresenceLight("1").glow).toBe(true);
  });

  it("creates memory river", () => {
    expect(createMemoryRiver().flow).toBe("soft");
  });
});
