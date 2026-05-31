import { describe, expect, it } from "vitest";
import { createOfflineCapsule, capsuleHasEntity } from "@/src/core/lumaspace/omega/offline-civilization/offlineCapsule";
import { queueOfflineCivilizationAction, markOfflineActionSynced } from "@/src/core/lumaspace/omega/offline-civilization/offlineQueue";
import { syncOfflineCivilization } from "@/src/core/lumaspace/omega/offline-civilization/syncEngine";
import { runLumaSpaceOmegaMegaPack21Runtime } from "@/src/core/lumaspace/omega/offline-civilization/omegaPack21Runtime";

describe("LumaSpace Ω∞ Mega Pack 21 — Offline Civilization Runtime", () => {
  it("creates ready offline capsule", () => {
    const capsule = createOfflineCapsule({ citizenId: "u1" });
    expect(capsule.ready).toBe(true);
    expect(capsuleHasEntity(capsule, "orbit")).toBe(true);
  });

  it("queues and marks offline action", () => {
    const action = queueOfflineCivilizationAction({ citizenId: "u1", kind: "send_light", payload: { targetId: "m1" } });
    expect(markOfflineActionSynced(action).synced).toBe(true);
  });

  it("syncs offline civilization queue", () => {
    const action = queueOfflineCivilizationAction({ citizenId: "u1", kind: "weave_memory", payload: { memoryId: "m1" } });
    const result = syncOfflineCivilization({ citizenId: "u1", actions: [action] });
    expect(result.report.synced).toBe(1);
  });

  it("runs full mega pack runtime", () => {
    expect(runLumaSpaceOmegaMegaPack21Runtime().ok).toBe(true);
  });
});
