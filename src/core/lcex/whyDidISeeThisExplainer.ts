export type WhyDidISeeThisInput = {
  entityId: string;
  sourceType:
    | "safe-seed"
    | "official-teaser"
    | "metadata-fallback"
    | "trend-signal"
    | "editorial"
    | "transformation"
    | "participation";
  trendScore?: number;
  confidenceScore?: number;
  region?: string;
  language?: string;
  matchedPreference?: string;
  culturalAdjustmentApplied?: boolean;
  fallbackUsed?: boolean;
};

export type WhyDidISeeThisExplanation = {
  title: string;
  bullets: string[];
  shortText: string;
};

function buildSourceReason(sourceType: WhyDidISeeThisInput["sourceType"]): string {
  switch (sourceType) {
    case "safe-seed":
      return "It came from Lumora's curated starter discovery layer.";
    case "official-teaser":
      return "It was surfaced from a trusted official teaser source.";
    case "metadata-fallback":
      return "Media was limited, so Lumora used a metadata-safe version.";
    case "trend-signal":
      return "It is gaining momentum across Lumora's trend signals.";
    case "editorial":
      return "It was selected through Lumora's editorial discovery logic.";
    case "transformation":
      return "It was surfaced as a Lumora-native transformed discovery item.";
    case "participation":
      return "It is connected to an interactive participation signal.";
    default:
      return "It matched Lumora's discovery system.";
  }
}

export function buildWhyDidISeeThisExplanation(
  input: WhyDidISeeThisInput
): WhyDidISeeThisExplanation {
  const bullets: string[] = [buildSourceReason(input.sourceType)];

  if (typeof input.trendScore === "number") {
    bullets.push(`Trend score contributed: ${Math.round(input.trendScore)}.`);
  }

  if (typeof input.confidenceScore === "number") {
    bullets.push(`Confidence score contributed: ${Math.round(input.confidenceScore)}.`);
  }

  if (input.matchedPreference) {
    bullets.push(`It aligned with your current focus: ${input.matchedPreference}.`);
  }

  if (input.region) {
    bullets.push(`Regional context considered: ${input.region.toLowerCase()}.`);
  }

  if (input.language) {
    bullets.push(`Language context considered: ${input.language.toLowerCase()}.`);
  }

  if (input.culturalAdjustmentApplied) {
    bullets.push("Cultural safety adjustments were applied before surfacing.");
  }

  if (input.fallbackUsed) {
    bullets.push("A fallback display mode was used to preserve safe discovery.");
  }

  return {
    title: "Why did I see this?",
    bullets,
    shortText: bullets.slice(0, 2).join(" "),
  };
}

export function hasExplainableDiscoveryReason(
  explanation: WhyDidISeeThisExplanation
): boolean {
  return explanation.bullets.length > 0 && explanation.shortText.trim().length > 0;
}
