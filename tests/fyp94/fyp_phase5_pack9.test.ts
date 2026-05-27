import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  PLAYER_UX_CONTRACT,
  buildPlayerUxState,
  validatePlayerUxContract,
} from "../../scripts/fyp94/player_ux_contract.mjs";

describe("Phase 5 Pack 9 — User Experience Engine", () => {
  it("locks required player UX contract", () => {
    expect(validatePlayerUxContract(PLAYER_UX_CONTRACT)).toBe(true);
  });

  it("builds player UX labels", () => {
    const state = buildPlayerUxState({ paused: true, muted: true, index: 2, total: 10 });

    expect(state.label).toBe("Paused");
    expect(state.soundLabel).toBe("Tap for sound");
    expect(state.canAutoNext).toBe(true);
  });

  it("verifies page has required playback handlers", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");

    expect(page).toContain("autoPlay");
    expect(page).toContain("muted={muted}");
    expect(page).toContain("onClick={togglePlay}");
    expect(page).toContain("toggleMute");
    expect(page).toContain("onEnded={goNext}");
  });
});
