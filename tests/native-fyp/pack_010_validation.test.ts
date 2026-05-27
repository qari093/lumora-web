import { describe, expect, it } from "vitest";
import {
  createInitialPlayerState,
  activateVideo,
  toggleMute,
} from "../../src/lib/native-fyp/runtime/player";
import { buildPreloadPlan } from "../../src/lib/native-fyp/runtime/preload";

const base = {
  sourceType: "lumora_generated",
  rightsStatus: "verified",
  licenseType: "lumora_generated",
  playbackUrl: "/v.mp4",
  posterUrl: "/v.jpg",
  durationSeconds: 10,
  createdAt: new Date().toISOString(),
};

describe("native fyp pack 010", () => {
  it("player activates video", () => {
    const s = createInitialPlayerState();
    const next = activateVideo(s, "1");
    expect(next.activeId).toBe("1");
  });

  it("toggles mute", () => {
    const s = createInitialPlayerState();
    const next = toggleMute(s);
    expect(next.isMuted).toBe(false);
  });

  it("preload plan wifi", () => {
    const items = Array.from({ length: 5 }).map((_, i) => ({
      ...base,
      id: String(i),
      title: "v" + i,
    }));
    const p = buildPreloadPlan(items, 0, "wifi");
    expect(p.preloadIds.length).toBeGreaterThan(0);
  });

  it("preload plan data saver", () => {
    const items = Array.from({ length: 5 }).map((_, i) => ({
      ...base,
      id: String(i),
      title: "v" + i,
    }));
    const p = buildPreloadPlan(items, 0, "data_saver");
    expect(p.preloadIds.length).toBe(0);
  });
});
