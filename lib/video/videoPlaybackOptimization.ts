export type PlaybackProfile = {
  networkMbps: number;
  deviceMemoryGb?: number;
  prefersDataSaver?: boolean;
  viewportHeight?: number;
};

export type PlaybackDecision = {
  autoplay: boolean;
  preload: "none" | "metadata" | "auto";
  preferredResolution: 360 | 480 | 720 | 1080;
  bufferAheadSec: number;
  usePosterFirst: boolean;
};

export function optimizeVideoPlayback(profile: PlaybackProfile): PlaybackDecision {
  const network = Number.isFinite(profile.networkMbps) ? profile.networkMbps : 0;
  const memory = Number.isFinite(profile.deviceMemoryGb) ? profile.deviceMemoryGb! : 2;
  const saver = Boolean(profile.prefersDataSaver);
  const viewport = Number.isFinite(profile.viewportHeight) ? profile.viewportHeight! : 720;

  let preferredResolution: 360 | 480 | 720 | 1080 = 480;
  let preload: "none" | "metadata" | "auto" = "metadata";
  let autoplay = true;
  let bufferAheadSec = 8;
  let usePosterFirst = false;

  if (saver || network < 1.5) {
    preferredResolution = 360;
    preload = "none";
    autoplay = false;
    bufferAheadSec = 4;
    usePosterFirst = true;
  } else if (network < 3) {
    preferredResolution = 480;
    preload = "metadata";
    autoplay = true;
    bufferAheadSec = 6;
  } else if (network < 8) {
    preferredResolution = viewport >= 900 ? 720 : 480;
    preload = "metadata";
    autoplay = true;
    bufferAheadSec = 8;
  } else {
    preferredResolution = viewport >= 1080 && memory >= 4 ? 1080 : 720;
    preload = "auto";
    autoplay = true;
    bufferAheadSec = 12;
  }

  if (memory < 2) {
    preload = preload === "auto" ? "metadata" : preload;
    bufferAheadSec = Math.min(bufferAheadSec, 6);
  }

  return {
    autoplay,
    preload,
    preferredResolution,
    bufferAheadSec,
    usePosterFirst
  };
}
