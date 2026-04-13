import type { LumoraUserProfile } from "@/types/profile/lumora.profile";

export function buildUserProfile(id: string): LumoraUserProfile {
  const now = Date.now();
  return {
    id,
    language: "en",
    region: "global",
    interests: [],
    emotionalPreferences: [],
    pacingPreference: "balanced",
    createdAt: now,
    updatedAt: now,
  };
}
