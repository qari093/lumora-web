export type WhyThisIsHeatingInput = {
  entityId: string;
  title: string;
  reasons: string[];
  trendScore: number;
  confidenceScore: number;
  createdAt: string;
};

export type WhyThisIsHeatingOutput = {
  id: string;
  type: "why-this-is-heating";
  entityId: string;
  title: string;
  headline: string;
  bullets: string[];
  summary: string;
  createdAt: string;
};

function clampReasons(reasons: string[]): string[] {
  return reasons.map((r) => r.trim()).filter(Boolean).slice(0, 4);
}

export function buildWhyThisIsHeatingShortFormat(
  input: WhyThisIsHeatingInput
): WhyThisIsHeatingOutput {
  const bullets = clampReasons(input.reasons);

  return {
    id: `why-this-is-heating:${input.entityId}:${Date.parse(input.createdAt) || Date.now()}`,
    type: "why-this-is-heating",
    entityId: input.entityId,
    title: input.title,
    headline: `${input.title} — why this is heating`,
    bullets,
    summary: `Trend ${Math.round(input.trendScore)} · Confidence ${Math.round(input.confidenceScore)} · ${bullets[0] || "Momentum rising."}`,
    createdAt: input.createdAt,
  };
}

export function isWhyThisIsHeatingUsable(
  output: WhyThisIsHeatingOutput
): boolean {
  return (
    output.title.trim().length > 0 &&
    output.headline.trim().length > 0 &&
    output.summary.trim().length > 0 &&
    output.bullets.length > 0
  );
}
