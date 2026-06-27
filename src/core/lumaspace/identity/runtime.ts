export type LumaProfileMode = "image" | "cinematic" | "aura";
export type LumaIdentityMood = "wonder" | "calm" | "dream" | "focus" | "healing" | "shadow";

export type LumaIdentityState = {
  name: string;
  aura: "Dreamer" | "Explorer" | "Creator" | "Guardian" | "Story Keeper";
  mood: LumaIdentityMood;
  profileMode: LumaProfileMode;
  quote: string;
};

export const defaultLumaIdentity: LumaIdentityState = {
  name: "Waqar",
  aura: "Dreamer",
  mood: "wonder",
  profileMode: "aura",
  quote: "Collecting moments. Building dreams. Returning home."
};

export function getIdentityModeLabel(mode: LumaProfileMode): string {
  if (mode === "image") return "Image Profile";
  if (mode === "cinematic") return "Cinematic Profile";
  return "Aura Profile";
}
