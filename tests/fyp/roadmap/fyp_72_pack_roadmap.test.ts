import { describe, expect, it } from "vitest";

import {
  LUMORA_FYP_TOTAL_PACKS,
  LUMORA_FYP_REQUIRED_PRODUCTION_PACKS,
  LUMORA_FYP_ENGINE_CREATION_PACKS,
  LUMORA_FYP_OPTIONAL_EVOLUTION_PACKS,
  LUMORA_FYP_72_PACK_SEGMENTS,
  assertLumoraFyp72Roadmap
} from "@/src/core/fyp/roadmap/fypRoadmap72";

describe("Lumora FYP 72-Pack Roadmap", () => {
  it("updates total FYP roadmap to 72 packs", () => {
    expect(LUMORA_FYP_TOTAL_PACKS).toBe(72);
    expect(LUMORA_FYP_REQUIRED_PRODUCTION_PACKS).toBe(40);
    expect(LUMORA_FYP_ENGINE_CREATION_PACKS).toBe(32);
    expect(LUMORA_FYP_OPTIONAL_EVOLUTION_PACKS).toBe(32);
  });

  it("locks required and optional roadmap segments", () => {
    expect(LUMORA_FYP_72_PACK_SEGMENTS).toHaveLength(7);
    expect(LUMORA_FYP_72_PACK_SEGMENTS[0]?.fromPack).toBe(1);
    expect(LUMORA_FYP_72_PACK_SEGMENTS.at(-1)?.toPack).toBe(72);
  });

  it("validates complete 72-pack roadmap integrity", () => {
    expect(assertLumoraFyp72Roadmap()).toBe(true);
  });
});
