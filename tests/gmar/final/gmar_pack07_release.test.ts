import { describe, it, expect } from "vitest";

import { AAA_GAMES } from "../../../src/core/gmar/final/gameRegistry";
import { loadGame } from "../../../src/core/gmar/final/gameLoader";
import { liveReady } from "../../../src/core/gmar/final/liveReadiness";
import { deploymentReady } from "../../../src/core/gmar/final/deploymentReady";
import { releaseSeal } from "../../../src/core/gmar/final/releaseSeal";

describe("GMAR PACK 7", () => {
  it("contains aaa games", () => {
    expect(AAA_GAMES.length).toBe(3);
  });

  it("loads games", () => {
    expect(loadGame("Pulse Grid")).toBe(true);
  });

  it("supports live readiness", () => {
    expect(liveReady(2).ready).toBe(true);
  });

  it("supports deployment readiness", () => {
    expect(deploymentReady(true).deployable).toBe(true);
  });

  it("creates release seal", () => {
    expect(releaseSeal()).toContain("READY");
  });
});
