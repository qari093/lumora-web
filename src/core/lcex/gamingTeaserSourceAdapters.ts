import type { TeaserIngestionInput, TeaserIngestionResult } from "./teaserIngestionContract";
import { validateTeaserIngestionInput } from "./teaserIngestionContract";

export type GamingTeaserSourceAdapter = {
  id: string;
  label: string;
  supportedDomains: string[];
  normalize(input: TeaserIngestionInput): TeaserIngestionInput;
};

function normalizeCommonGamingFields(
  input: TeaserIngestionInput
): TeaserIngestionInput {
  return {
    ...input,
    category: "gaming",
    title: input.title.trim(),
    sourceDomain: input.sourceDomain.trim().toLowerCase(),
    sourceName: input.sourceName.trim(),
    language: input.language?.trim().toLowerCase() || "en",
    region: input.region?.trim().toLowerCase() || "global",
    rightsHint: input.rightsHint ?? "unknown",
  };
}

export const GAMING_TEASER_SOURCE_ADAPTERS: GamingTeaserSourceAdapter[] = [
  {
    id: "official-publisher-gaming-adapter",
    label: "Official Publisher Gaming Adapter",
    supportedDomains: ["publisher.example", "game.example", "lumora.app"],
    normalize(input) {
      return normalizeCommonGamingFields(input);
    },
  },
  {
    id: "platform-event-gaming-adapter",
    label: "Platform Event Gaming Adapter",
    supportedDomains: ["platform.example"],
    normalize(input) {
      return normalizeCommonGamingFields(input);
    },
  },
];

export function getGamingTeaserSourceAdapter(
  domain: string
): GamingTeaserSourceAdapter | undefined {
  const needle = domain.trim().toLowerCase();
  return GAMING_TEASER_SOURCE_ADAPTERS.find((adapter) =>
    adapter.supportedDomains.includes(needle)
  );
}

export function adaptGamingTeaserInput(
  input: TeaserIngestionInput
): TeaserIngestionResult {
  const adapter = getGamingTeaserSourceAdapter(input.sourceDomain);
  const normalized = adapter
    ? adapter.normalize(input)
    : normalizeCommonGamingFields(input);

  return validateTeaserIngestionInput(normalized);
}
