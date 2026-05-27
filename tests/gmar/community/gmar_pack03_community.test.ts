import { describe, it, expect } from "vitest";

import { offlineMode } from "../../../src/core/gmar/offline/offlineRuntime";
import { antiCheat } from "../../../src/core/gmar/security/antiCheat";
import { detectBot } from "../../../src/core/gmar/security/antiBot";
import { createSquad } from "../../../src/core/gmar/community/squads";
import { joinLiveRoom } from "../../../src/core/gmar/live/liveRooms";

describe("GMAR PACK 3", () => {
  it("supports offline mode", () => {
    expect(offlineMode(true).enabled).toBe(true);
  });

  it("detects cheats", () => {
    expect(antiCheat(99).suspicious).toBe(true);
  });

  it("detects bots", () => {
    expect(detectBot(500)).toBe(true);
  });

  it("creates squad", () => {
    expect(createSquad("Omega").members).toBe(1);
  });

  it("joins live room", () => {
    expect(joinLiveRoom("arena").joined).toBe(true);
  });
});
