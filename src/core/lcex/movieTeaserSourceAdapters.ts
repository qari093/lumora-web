import type { TeaserIngestionInput, TeaserIngestionResult } from "./teaserIngestionContract";
import { validateTeaserIngestionInput } from "./teaserIngestionContract";

export type MovieTeaserSourceAdapter = {
  id: string;
  label: string;
  supportedDomains: string[];
  normalize(input: TeaserIngestionInput): TeaserIngestionInput;
};

function normalizeCommonMovieFields(
  input: TeaserIngestionInput
): TeaserIngestionInput {
  return {
    ...input,
    category: "movie",
    title: input.title.trim(),
    sourceDomain: input.sourceDomain.trim().toLowerCase(),
    sourceName: input.sourceName.trim(),
    language: input.language?.trim().toLowerCase() || "en",
    region: input.region?.trim().toLowerCase() || "global",
    rightsHint: input.rightsHint ?? "unknown",
  };
}

export const MOVIE_TEASER_SOURCE_ADAPTERS: MovieTeaserSourceAdapter[] = [
  {
    id: "official-studio-movie-adapter",
    label: "Official Studio Movie Adapter",
    supportedDomains: ["official.example", "studio.example", "lumora.app"],
    normalize(input) {
      return normalizeCommonMovieFields(input);
    },
  },
  {
    id: "distributor-movie-adapter",
    label: "Distributor Movie Adapter",
    supportedDomains: ["distributor.example"],
    normalize(input) {
      return normalizeCommonMovieFields(input);
    },
  },
];

export function getMovieTeaserSourceAdapter(
  domain: string
): MovieTeaserSourceAdapter | undefined {
  const needle = domain.trim().toLowerCase();
  return MOVIE_TEASER_SOURCE_ADAPTERS.find((adapter) =>
    adapter.supportedDomains.includes(needle)
  );
}

export function adaptMovieTeaserInput(
  input: TeaserIngestionInput
): TeaserIngestionResult {
  const adapter = getMovieTeaserSourceAdapter(input.sourceDomain);
  const normalized = adapter
    ? adapter.normalize(input)
    : normalizeCommonMovieFields(input);

  return validateTeaserIngestionInput(normalized);
}
