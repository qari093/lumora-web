export const monitoredSources = [
  "kofa",
  "mosfilm",
  "internet-archive",
  "nfb",
  "films-division-india",
] as const;

export type FirehoseSource = (typeof monitoredSources)[number];

export function queueFilm(source: FirehoseSource | string) {
  return {
    source,
    queued: true,
  };
}

export function autoApproveFilm(rightsVerified: boolean) {
  return rightsVerified === true;
}

export function shouldRunTeaserPipeline(input: {
  queued: boolean;
  rightsVerified: boolean;
}) {
  return input.queued && input.rightsVerified;
}
