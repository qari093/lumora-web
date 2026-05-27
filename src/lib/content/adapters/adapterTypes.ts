import type { RawSourceClip } from "@/src/lib/content/pipeline/types";

export type SourceAdapterGroup =
  | "space-science"
  | "archive-government"
  | "cultural-library"
  | "stock-platform"
  | "regional-specialized";

export type SourceAdapter = {
  id: string;
  name: string;
  group: SourceAdapterGroup;
  enabled: boolean;
  fetch: () => Promise<RawSourceClip[]>;
};

export function buildAdapterClip(input: RawSourceClip): RawSourceClip {
  return {
    ...input,
    title: input.title || "Lumora Clip",
    sourceUrl: input.sourceUrl || "",
    durationSeconds: input.durationSeconds || 30,
  };
}
