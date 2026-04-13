import type { TeaserIngestionInput, TeaserIngestionResult } from "./teaserIngestionContract";
import { validateTeaserIngestionInput } from "./teaserIngestionContract";

export type MusicTeaserSourceAdapter = {
  id: string;
  label: string;
  supportedDomains: string[];
  normalize(input: TeaserIngestionInput): TeaserIngestionInput;
};

function normalizeCommonMusicFields(
  input: TeaserIngestionInput
): TeaserIngestionInput {
  return {
    ...input,
    category: "music",
    title: input.title.trim(),
    sourceDomain: input.sourceDomain.trim().toLowerCase(),
    sourceName: input.sourceName.trim(),
    language: input.language?.trim().toLowerCase() || "en",
    region: input.region?.trim().toLowerCase() || "global",
    rightsHint: input.rightsHint ?? "unknown",
  };
}

export const MUSIC_TEASER_SOURCE_ADAPTERS: MusicTeaserSourceAdapter[] = [
  {
    id: "official-label-music-adapter",
    label: "Official Label Music Adapter",
    supportedDomains: ["label.example", "music.example", "lumora.app"],
    normalize(input) {
      return normalizeCommonMusicFields(input);
    },
  },
  {
    id: "artist-channel-music-adapter",
    label: "Artist Channel Music Adapter",
    supportedDomains: ["artist.example"],
    normalize(input) {
      return normalizeCommonMusicFields(input);
    },
  },
];

export function getMusicTeaserSourceAdapter(
  domain: string
): MusicTeaserSourceAdapter | undefined {
  const needle = domain.trim().toLowerCase();
  return MUSIC_TEASER_SOURCE_ADAPTERS.find((adapter) =>
    adapter.supportedDomains.includes(needle)
  );
}

export function adaptMusicTeaserInput(
  input: TeaserIngestionInput
): TeaserIngestionResult {
  const adapter = getMusicTeaserSourceAdapter(input.sourceDomain);
  const normalized = adapter
    ? adapter.normalize(input)
    : normalizeCommonMusicFields(input);

  return validateTeaserIngestionInput(normalized);
}
