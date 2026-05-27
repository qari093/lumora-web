import { describe, expect, it } from "vitest";
import {
  allowedLicenses,
  verifyRights,
  shouldDisableFilm,
  createRightsIncidentTicket,
} from "../../src/cineverse/rights/runtime";

describe("CineVerse Pack 14 — Rights + Safety", () => {
  it("supports legal licenses", () => {
    expect(allowedLicenses).toContain("public-domain");
  });

  it("verifies legal film rights", () => {
    expect(
      verifyRights({
        official: true,
        embeddable: true,
        license: "public-domain",
      })
    ).toBe(true);
  });

  it("disables unsafe films", () => {
    expect(
      shouldDisableFilm({
        rightsIssue: true,
        regionBlocked: false,
      })
    ).toBe(true);
  });

  it("creates rights incident tickets", () => {
    expect(createRightsIncidentTicket("film_1").autoDisabled).toBe(true);
  });
});
