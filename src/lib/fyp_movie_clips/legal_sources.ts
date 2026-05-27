export type SafeMovieSourceType =
  | "public-domain"
  | "creative-commons-commercial"
  | "owned-license"
  | "allowed-embed";

export type SafeMovieSource = {
  id: string;
  name: string;
  type: SafeMovieSourceType;
  baseUrl: string;
  commercialAllowed: boolean;
  requiresAttribution: boolean;
};

export const SAFE_MOVIE_SOURCES: SafeMovieSource[] = [
  {
    id: "internet-archive-public-domain",
    name: "Internet Archive Public Domain Films",
    type: "public-domain",
    baseUrl: "https://archive.org",
    commercialAllowed: true,
    requiresAttribution: true,
  },
  {
    id: "prelinger-archives",
    name: "Prelinger Archives",
    type: "public-domain",
    baseUrl: "https://archive.org/details/prelinger",
    commercialAllowed: true,
    requiresAttribution: true,
  },
  {
    id: "owned-lumora-license",
    name: "Owned / Licensed Lumora Clips",
    type: "owned-license",
    baseUrl: "lumora://licensed",
    commercialAllowed: true,
    requiresAttribution: false,
  },
];

export function isSafeMovieSource(sourceId: string): boolean {
  return SAFE_MOVIE_SOURCES.some((source) => source.id === sourceId && source.commercialAllowed);
}

export function getSafeMovieSource(sourceId: string): SafeMovieSource | null {
  return SAFE_MOVIE_SOURCES.find((source) => source.id === sourceId) || null;
}
