import type { TeaserIngestionInput, TeaserIngestionResult } from "./teaserIngestionContract";
import { validateTeaserIngestionInput } from "./teaserIngestionContract";

export type SeriesTeaserSourceAdapter = {
  id: string;
  label: string;
  supportedDomains: string[];
  normalize(input: TeaserIngestionInput): TeaserIngestionInput;
};

function normalizeCommonSeriesFields(
  input: TeaserIngestionInput
): TeaserIngestionInput {
  return {
    ...input,
    category: "series",
    title: input.title.trim(),
    sourceDomain: input.sourceDomain.trim().toLowerCase(),
    sourceName: input.sourceName.trim(),
    language: input.language?.trim().toLowerCase() || "en",
    region: input.region?.trim().toLowerCase() || "global",
    rightsHint: input.rightsHint ?? "unknown",
  };
}

export const SERIES_TEASER_SOURCE_ADAPTERS: SeriesTeaserSourceAdapter[] = [
  {
    id: "official-network-series-adapter",
    label: "Official Network Series Adapter",
    supportedDomains: ["network.example", "series.example", "lumora.app"],
    normalize(input) {
      return normalizeCommonSeriesFields(input);
    },
  },
  {
    id: "streaming-platform-series-adapter",
    label: "Streaming Platform Series Adapter",
    supportedDomains: ["streaming.example"],
    normalize(input) {
      return normalizeCommonSeriesFields(input);
    },
  },
];

export function getSeriesTeaserSourceAdapter(
  domain: string
): SeriesTeaserSourceAdapter | undefined {
  const needle = domain.trim().toLowerCase();
  return SERIES_TEASER_SOURCE_ADAPTERS.find((adapter) =>
    adapter.supportedDomains.includes(needle)
  );
}

export function adaptSeriesTeaserInput(
  input: TeaserIngestionInput
): TeaserIngestionResult {
  const adapter = getSeriesTeaserSourceAdapter(input.sourceDomain);
  const normalized = adapter
    ? adapter.normalize(input)
    : normalizeCommonSeriesFields(input);

  return validateTeaserIngestionInput(normalized);
}
