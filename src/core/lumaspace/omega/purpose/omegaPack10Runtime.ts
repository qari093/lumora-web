import { createSkillSignal } from "./skillEngine";
import { createPurposeProfile } from "./profileEngine";
import { createPurposeMatch, rankPurposeMatches } from "./matchingEngine";
import { createPurposeMission, advancePurposeMission } from "./missionEngine";
import { createPurposeReward } from "./rewardEngine";

export function runLumaSpaceOmegaMegaPack10Runtime() {
  const profileA = createPurposeProfile({
    citizenId: "omega-a",
    modes: ["collaboration", "builder_partner", "mission_partner"],
    skills: [
      createSkillSignal({
        id: "skill-a-code",
        citizenId: "omega-a",
        skill: "frontend",
        level: "advanced",
        offering: true,
        seeking: false,
      }),
      createSkillSignal({
        id: "skill-a-design",
        citizenId: "omega-a",
        skill: "design",
        level: "intermediate",
        offering: false,
        seeking: true,
      }),
    ],
    missionDomains: ["creation", "learning"],
    availability: "high",
    consentGranted: true,
  });

  const profileB = createPurposeProfile({
    citizenId: "omega-b",
    modes: ["collaboration", "builder_partner", "mission_partner"],
    skills: [
      createSkillSignal({
        id: "skill-b-design",
        citizenId: "omega-b",
        skill: "design",
        level: "advanced",
        offering: true,
        seeking: false,
      }),
      createSkillSignal({
        id: "skill-b-code",
        citizenId: "omega-b",
        skill: "frontend",
        level: "intermediate",
        offering: false,
        seeking: true,
      }),
    ],
    missionDomains: ["creation", "wellness"],
    availability: "medium",
    consentGranted: true,
  });

  const match = createPurposeMatch({
    a: profileA,
    b: profileB,
    mode: "builder_partner",
  });

  const ranked = rankPurposeMatches([match]);
  let mission = createPurposeMission({ match, title: "Build a 7-day creative habit together" });
  mission = advancePurposeMission(mission, 60);
  mission = advancePurposeMission(mission, 40);
  const reward = createPurposeReward(match, mission);

  return {
    ok:
      match.matchScore > 0 &&
      ranked[0].id === match.id &&
      mission.progress === 100 &&
      Boolean(mission.sharedMemoryId) &&
      reward.unlocked &&
      reward.rewardKind === "shared_memory",
    profileA,
    profileB,
    match,
    ranked,
    mission,
    reward,
  };
}
