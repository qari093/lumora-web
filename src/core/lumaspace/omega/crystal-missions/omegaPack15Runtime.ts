import { createCrystalMission, activateMission } from "./missionEngine";
import { applyMissionContribution, createMissionContribution, missionProgressPercent } from "./progressEngine";
import { distributeMissionRewards } from "./rewardEngine";

export function runLumaSpaceOmegaMegaPack15Runtime() {
  let mission = activateMission(createCrystalMission({
    id: "mission-015",
    communityId: "community-015",
    title: "Build 100 shared lights",
    kind: "community",
    target: 100,
    zencoinPool: 300,
  }));

  mission = applyMissionContribution(mission, createMissionContribution({
    missionId: mission.id,
    citizenId: "u1",
    amount: 40,
    note: "First wave",
  }));

  mission = applyMissionContribution(mission, createMissionContribution({
    missionId: mission.id,
    citizenId: "u2",
    amount: 60,
    note: "Final wave",
  }));

  const rewards = distributeMissionRewards(mission);

  return {
    ok:
      mission.status === "completed" &&
      missionProgressPercent(mission) === 100 &&
      mission.participantIds.length === 2 &&
      rewards.length === 2 &&
      rewards.every((reward) => reward.memoryUnlocked && reward.zencoinAmount === 150),
    mission,
    rewards,
  };
}
