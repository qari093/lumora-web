export type LumoraUserProfile = {
  id: string;
  language?: string;
  region?: string;
  interests: string[];
  emotionalPreferences: string[];
  pacingPreference?: "slow" | "balanced" | "fast";
  createdAt: number;
  updatedAt: number;
};
