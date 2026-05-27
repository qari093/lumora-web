export const contentPopulationSystems = [
  "global-source-registry",
  "subtitle-routing",
  "rights-validation",
  "webtorrent-fallback",
  "emotional-keyframes",
  "canon-sealing",
] as const;

export function validateFilmSource(source: {
  verified: boolean;
  embeddable: boolean;
}) {
  return source.verified && source.embeddable;
}

export function buildCanonSeal() {
  return {
    status: "sealed",
    filmsReady: true,
  };
}
