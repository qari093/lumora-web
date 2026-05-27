import { describe, expect, it } from "vitest";
import {
  createLumoraTeaserPayload,
  trackLumoraImpression,
} from "../../src/cineverse/lumora/runtime";

describe("CineVerse Pack 11 — Lumora Integration", () => {
  it("creates teaser payloads", () => {
    const payload = createLumoraTeaserPayload("teaser_abc");

    expect(payload.destination).toBe("lumora-fyp");
    expect(payload.deepLink).toContain("teaser_abc");
  });

  it("tracks Lumora impressions", () => {
    expect(trackLumoraImpression("user_1").tracked).toBe(true);
  });
});
