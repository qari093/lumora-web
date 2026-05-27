import { describe, expect, it } from "vitest";
import { offlineRecoveryHealthy } from "../../../src/core/gmar/offline-recovery/runtime";

describe("GMAR Pack 31 — Offline Recovery + Persistence", () => {
  it("validates offline recovery", () => {
    const recovery = offlineRecoveryHealthy();

    expect(recovery.offlineQueue).toBe(true);
    expect(recovery.stateRestore).toBe(true);
    expect(recovery.conflictProtected).toBe(true);
  });
});
