import { addFestivalContribution, completeFestival, createFestivalOfStars, createFestivalReward, startFestival } from "./festivalEngine";

export function runLumaSpaceOmegaMegaPack18Runtime() {
  let festival = startFestival(createFestivalOfStars({
    id: "festival-018",
    title: "Festival of Stars",
    globalMissionId: "global-mission-018",
  }));

  const out = addFestivalContribution({
    festival,
    citizenId: "citizen-018",
    lightAmount: 12,
  });

  festival = completeFestival(out.festival);
  const reward = createFestivalReward(out.contribution);

  return {
    ok:
      festival.status === "completed" &&
      festival.activeSpaceCount === 1 &&
      out.contribution.lightAmount === 12 &&
      reward.reward === "global_thread",
    festival,
    contribution: out.contribution,
    reward,
  };
}
