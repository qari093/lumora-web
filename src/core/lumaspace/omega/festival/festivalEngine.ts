import type { FestivalContribution, FestivalOfStars, FestivalReward } from "./types";

export function createFestivalOfStars(input: {
  id: string;
  title: string;
  globalMissionId: string;
}): FestivalOfStars {
  if (!input.id.trim()) throw new Error("festival_id_required");

  return {
    id: input.id,
    title: input.title,
    status: "scheduled",
    activeSpaceCount: 0,
    globalMissionId: input.globalMissionId,
    ritualPrompt: "Send one light beyond your familiar sky.",
  };
}

export function startFestival(festival: FestivalOfStars): FestivalOfStars {
  return { ...festival, status: "live" };
}

export function addFestivalContribution(input: {
  festival: FestivalOfStars;
  citizenId: string;
  lightAmount: number;
}): { festival: FestivalOfStars; contribution: FestivalContribution } {
  if (input.festival.status !== "live") throw new Error("festival_not_live");

  return {
    festival: { ...input.festival, activeSpaceCount: input.festival.activeSpaceCount + 1 },
    contribution: {
      id: `festival_contribution_${input.festival.id}_${input.citizenId}`,
      festivalId: input.festival.id,
      citizenId: input.citizenId,
      lightAmount: Math.max(1, input.lightAmount),
    },
  };
}

export function completeFestival(festival: FestivalOfStars): FestivalOfStars {
  return { ...festival, status: "completed" };
}

export function createFestivalReward(contribution: FestivalContribution): FestivalReward {
  return {
    id: `festival_reward_${contribution.festivalId}_${contribution.citizenId}`,
    citizenId: contribution.citizenId,
    reward: contribution.lightAmount >= 10 ? "global_thread" : "festival_bloom",
  };
}
