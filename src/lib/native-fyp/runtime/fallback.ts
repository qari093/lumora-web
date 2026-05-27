import type { NativeFypVideo } from "../schema";

export function buildEventsFallback(): NativeFypVideo[] {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: "fallback_" + i,
    title: "Fallback " + i,
    sourceType: "lumora_generated",
    rightsStatus: "verified",
    licenseType: "lumora_generated",
    playbackUrl: "/native-fyp/fallback.mp4",
    posterUrl: "/native-fyp/fallback.jpg",
    durationSeconds: 10,
    createdAt: new Date().toISOString(),
  }));
}
