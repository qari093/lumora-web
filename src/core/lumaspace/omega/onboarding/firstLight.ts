export type FirstLightMoodSeed = "calm" | "creative" | "focused" | "healing" | "builder";

export type FirstLightInput = {
  citizenId: string;
  interests: string[];
  moodSeed: FirstLightMoodSeed;
  openingVerse: string;
};

export type FirstLightExperience = {
  id: string;
  citizenId: string;
  durationSeconds: 7;
  format: "vertical_cinematic";
  haptic: "single_heartbeat";
  closingLine: "You are home.";
  visualSeeds: string[];
  moodSeed: FirstLightMoodSeed;
  openingVerse: string;
  completed: boolean;
};

export function createFirstLightExperience(input: FirstLightInput): FirstLightExperience {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");
  if (input.interests.length < 1) throw new Error("at_least_one_interest_required");
  if (input.openingVerse.length > 60) throw new Error("opening_verse_too_long");

  return {
    id: `first_light_${input.citizenId}`,
    citizenId: input.citizenId,
    durationSeconds: 7,
    format: "vertical_cinematic",
    haptic: "single_heartbeat",
    closingLine: "You are home.",
    visualSeeds: input.interests.slice(0, 5),
    moodSeed: input.moodSeed,
    openingVerse: input.openingVerse,
    completed: false,
  };
}

export function completeFirstLight(experience: FirstLightExperience): FirstLightExperience {
  return { ...experience, completed: true };
}
