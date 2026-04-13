export type TrendToFilmTransformationInput = {
  entityId: string;
  title: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  trendSummary: string;
  moodTags: string[];
  sourceRef: string;
  createdAt: string;
};

export type TrendToFilmTransformationOutput = {
  id: string;
  type: "trend-to-film";
  entityId: string;
  title: string;
  hook: string;
  shortSummary: string;
  visualDirection: string;
  sourceRef: string;
  createdAt: string;
};

function buildHook(input: TrendToFilmTransformationInput): string {
  return `${input.title} is shifting from signal to story inside Lumora's trend-to-film layer.`;
}

function buildVisualDirection(input: TrendToFilmTransformationInput): string {
  const tags = input.moodTags.filter(Boolean).slice(0, 3).join(", ");
  return tags.length > 0
    ? `Visual direction: cinematic interpretation with ${tags} emphasis.`
    : "Visual direction: cinematic interpretation with premium teaser-style pacing.";
}

export function buildTrendToFilmTransformation(
  input: TrendToFilmTransformationInput
): TrendToFilmTransformationOutput {
  return {
    id: `trend-to-film:${input.entityId}:${Date.parse(input.createdAt) || Date.now()}`,
    type: "trend-to-film",
    entityId: input.entityId,
    title: input.title,
    hook: buildHook(input),
    shortSummary: input.trendSummary.trim(),
    visualDirection: buildVisualDirection(input),
    sourceRef: input.sourceRef,
    createdAt: input.createdAt,
  };
}

export function isTrendToFilmTransformationUsable(
  output: TrendToFilmTransformationOutput
): boolean {
  return (
    output.title.trim().length > 0 &&
    output.hook.trim().length > 0 &&
    output.shortSummary.trim().length > 0
  );
}
