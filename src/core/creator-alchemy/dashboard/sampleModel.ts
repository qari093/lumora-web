import type { BuildDashboardInput } from "./buildDashboard";

export const SAMPLE_BREATHING_DASHBOARD_INPUT: BuildDashboardInput = {
  stage: "resonance",
  daySignalStrength: 0.68,
  recentlyShownAtmospheres: 1,
  seed: {
    state: "growing",
    label: "Growing",
    log: "Your seed strengthened when people quietly returned this week."
  },
  whispers: [
    {
      id: "whisper-tone-softened",
      text: "People replayed the moment your tone softened at 0:42.",
      videoId: "demo-video-001",
      timestampSeconds: 42,
      priority: 10
    },
    {
      id: "whisper-quiet-ending",
      text: "Viewers lingered longer when your ending stayed quiet.",
      videoId: "demo-video-002",
      timestampSeconds: 58,
      priority: 8
    }
  ],
  orbs: [
    {
      creatorId: "self",
      displayName: "You",
      isSelf: true,
      pulse: false,
      constellation: "Midnight Souls"
    },
    {
      creatorId: "creator-quiet-1",
      displayName: "Quiet Voice",
      isSelf: false,
      pulse: true,
      constellation: "Midnight Souls"
    }
  ],
  quietImpact: {
    silentReturnsText: "Many quietly returned this month.",
    quietGiftsText: "3 candles and 7 leaves arrived softly.",
    legacyEchoText: "An older work quietly reached people again.",
    resonanceState: "blooming_current",
    horizonProgress: 0.38
  },
  creativeIntensityEnabled: false
};
