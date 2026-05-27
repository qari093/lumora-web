import { describe, expect, it } from "vitest";
import { createGhostSeed } from "@/src/core/celebrations/ghosts/ghostConstellations";
import { createDreamFragment } from "@/src/core/celebrations/dream/dreamThread";

describe("Celebrations Mega Pack 06", () => {
  it("creates ghost", () => {
    expect(createGhostSeed().fading).toBe(true);
  });

  it("creates dream fragment", () => {
    expect(createDreamFragment().poetic).toBe(true);
  });
});
