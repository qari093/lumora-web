export const allowedLicenses = [
  "public-domain",
  "cc-by",
  "cc0",
  "free-to-embed",
] as const;

export function verifyRights(source: {
  official: boolean;
  embeddable: boolean;
  license: string;
}) {
  return (
    source.official &&
    source.embeddable &&
    allowedLicenses.includes(source.license as (typeof allowedLicenses)[number])
  );
}

export function shouldDisableFilm(status: {
  rightsIssue: boolean;
  regionBlocked: boolean;
}) {
  return status.rightsIssue || status.regionBlocked;
}

export function createRightsIncidentTicket(filmId: string) {
  return {
    filmId,
    status: "open",
    autoDisabled: true,
    reviewTargetHours: 48,
  };
}
