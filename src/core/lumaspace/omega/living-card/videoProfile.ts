import type { VideoProfileState } from "./types";

export function createVideoProfile(input: {
  ownerId: string;
  durationSeconds: number;
  consentGranted: boolean;
  hasCaptions?: boolean;
  safeForDiscovery?: boolean;
}): VideoProfileState {
  if (!input.ownerId.trim()) throw new Error("ownerId_required");
  if (input.durationSeconds < 1) throw new Error("duration_too_short");
  if (input.durationSeconds > 15) throw new Error("duration_too_long");

  return {
    ownerId: input.ownerId,
    status: input.consentGranted ? "ready" : "draft",
    durationSeconds: input.durationSeconds,
    maxDurationSeconds: 15,
    hasCaptions: input.hasCaptions === true,
    safeForDiscovery: input.safeForDiscovery === true,
    consentGranted: input.consentGranted,
  };
}

export function disableVideoProfile(profile: VideoProfileState): VideoProfileState {
  return {
    ...profile,
    status: "disabled",
    safeForDiscovery: false,
  };
}

export function canShowVideoProfile(profile: VideoProfileState): boolean {
  return profile.status === "ready" && profile.consentGranted && profile.safeForDiscovery;
}
