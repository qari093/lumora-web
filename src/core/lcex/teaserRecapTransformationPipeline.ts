export type TeaserRecapTransformationInput = {
  entityId: string;
  title: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  keyMoments: string[];
  sourceRef: string;
  createdAt: string;
};

export type TeaserRecapTransformationOutput = {
  id: string;
  type: "teaser-recap";
  entityId: string;
  title: string;
  recapHeadline: string;
  bulletRecap: string[];
  sourceRef: string;
  createdAt: string;
};

function buildRecapHeadline(input: TeaserRecapTransformationInput): string {
  return `${input.title} — teaser recap`;
}

export function buildTeaserRecapTransformation(
  input: TeaserRecapTransformationInput
): TeaserRecapTransformationOutput {
  return {
    id: `teaser-recap:${input.entityId}:${Date.parse(input.createdAt) || Date.now()}`,
    type: "teaser-recap",
    entityId: input.entityId,
    title: input.title,
    recapHeadline: buildRecapHeadline(input),
    bulletRecap: input.keyMoments.filter(Boolean).slice(0, 5),
    sourceRef: input.sourceRef,
    createdAt: input.createdAt,
  };
}

export function isTeaserRecapTransformationUsable(
  output: TeaserRecapTransformationOutput
): boolean {
  return (
    output.title.trim().length > 0 &&
    output.recapHeadline.trim().length > 0 &&
    output.bulletRecap.length > 0
  );
}
