import { describe, expect, it } from "vitest";
import {
  canPlayFilm,
  createWatchSession,
} from "../../src/cineverse/watch/runtime";

describe("CineVerse Pack 07 — Watch Experience", () => {
  it("creates immersive watch sessions", () => {
    const session = createWatchSession({
      filmId: "film_1",
      provider: "youtube",
      embeddable: true,
    });

    expect(session.started).toBe(true);
    expect(session.immersiveMode).toBe(true);
  });

  it("blocks non-embeddable playback", () => {
    expect(
      canPlayFilm({
        filmId: "film_2",
        provider: "external",
        embeddable: false,
      })
    ).toBe(false);
  });
});
