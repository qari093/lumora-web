import { describe, expect, it } from "vitest";
import { fullscreenPlayback } from "@/src/core/cineverse/playback/fullscreenPlayback";

describe("codepack07", () => {
  it("cineverse runtime works", () => {
    expect(fullscreenPlayback.cinematic).toBe(true);
  });
});
