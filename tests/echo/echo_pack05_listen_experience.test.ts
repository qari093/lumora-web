import { describe, expect, it } from "vitest";
import { listenScreen, listenReady } from "../../src/echo/listen/listenScreen";
import { echoLensRuntime } from "../../src/echo/listen/echoLens";
import { persistentMiniPlayer } from "../../src/echo/listen/miniPlayer";
import { atmosphereDrawer } from "../../src/echo/listen/atmosphereDrawer";

describe("Echo Pack 05 — Listen Experience", () => {
  it("supports listen screen", () => {
    expect(listenScreen.aura).toBe(true);
    expect(listenReady()).toBe(true);
  });

  it("supports Echo Lens", () => {
    expect(echoLensRuntime().morphing).toBe(true);
  });

  it("supports mini-player and atmosphere drawer", () => {
    expect(persistentMiniPlayer().active).toBe(true);
    expect(atmosphereDrawer().overlays).toBe(true);
  });
});
