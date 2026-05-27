import { describe, expect, it } from "vitest";
import { cineverseFederationProviders } from "../../src/cineverse/federation/providers";
import { resolvePlaybackMode } from "../../src/cineverse/federation/runtime";

describe("CineVerse Pack 03 — Video Federation Engine", () => {
  it("supports global legal providers", () => {
    expect(cineverseFederationProviders.length).toBeGreaterThanOrEqual(6);
  });

  it("resolves embed playback for verified embeddable videos", () => {
    expect(resolvePlaybackMode({
      id: "film_1",
      title: "Verified Film",
      sourceType: "youtube",
      sourceUrl: "https://example.com",
      embeddable: true,
      rightsVerified: true,
    })).toBe("embed");
  });

  it("blocks unverified videos", () => {
    expect(resolvePlaybackMode({
      id: "film_2",
      title: "Unverified Film",
      sourceType: "deep_link",
      sourceUrl: "https://example.com",
      embeddable: false,
      rightsVerified: false,
    })).toBe("unavailable");
  });
});
