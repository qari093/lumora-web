export type FestivalStatus = "scheduled" | "live" | "completed";

export type FestivalOfStars = {
  id: string;
  title: string;
  status: FestivalStatus;
  activeSpaceCount: number;
  globalMissionId: string;
  ritualPrompt: string;
};

export type FestivalContribution = {
  id: string;
  festivalId: string;
  citizenId: string;
  lightAmount: number;
};

export type FestivalReward = {
  id: string;
  citizenId: string;
  reward: "festival_bloom" | "global_thread" | "starlight_badge";
};
