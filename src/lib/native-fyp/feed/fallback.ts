import type { NativeFypVideo } from "../schema";

export function buildEventsFallback(): NativeFypVideo[] {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `event_${i}`,
    title: `Today's Pulse #${i + 1}`,
    sourceType: "lumora_generated",
    rightsStatus: "verified",
    licenseType: "lumora_generated",
    playbackUrl: "/native-fyp/demo.mp4",
    posterUrl: "/native-fyp/demo.jpg",
    durationSeconds: 10,
    createdAt: new Date().toISOString(),
  }));
}
