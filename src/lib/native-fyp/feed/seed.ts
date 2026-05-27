import type { NativeFypVideo } from "../schema";

export function buildSeedFeed(): NativeFypVideo[] {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `seed_${i}`,
    title: `Seed Video ${i + 1}`,
    sourceType: "lumora_generated",
    rightsStatus: "verified",
    licenseType: "lumora_generated",
    playbackUrl: "/native-fyp/demo.mp4",
    posterUrl: "/native-fyp/demo.jpg",
    durationSeconds: 12,
    createdAt: new Date().toISOString(),
  }));
}
