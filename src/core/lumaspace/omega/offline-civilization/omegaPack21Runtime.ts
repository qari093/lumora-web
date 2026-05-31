import { createOfflineCapsule, capsuleHasEntity } from "./offlineCapsule";
import { queueOfflineCivilizationAction } from "./offlineQueue";
import { syncOfflineCivilization } from "./syncEngine";

export function runLumaSpaceOmegaMegaPack21Runtime() {
  const capsule = createOfflineCapsule({
    citizenId: "citizen-021",
    cachedEntities: ["orbit", "vault", "living_card", "community", "bridge", "chronicle"],
  });

  const actions = [
    queueOfflineCivilizationAction({
      citizenId: "citizen-021",
      kind: "send_light",
      payload: { targetId: "memory-021" },
    }),
    queueOfflineCivilizationAction({
      citizenId: "citizen-021",
      kind: "weave_memory",
      payload: { memoryId: "memory-021", destination: "vault" },
    }),
  ];

  const sync = syncOfflineCivilization({ citizenId: "citizen-021", actions });

  return {
    ok:
      capsule.ready &&
      capsuleHasEntity(capsule, "chronicle") &&
      sync.report.attempted === 2 &&
      sync.report.synced === 2 &&
      sync.actions.every((action) => action.synced),
    capsule,
    actions,
    sync,
  };
}
