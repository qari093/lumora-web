export interface InsightTemplateInput {
  signal: "rewatch" | "linger" | "save" | "return";
  moment?: string;
}

export function renderNonLlmInsight(input: InsightTemplateInput): string {
  switch (input.signal) {
    case "rewatch":
      return `People replayed ${input.moment ?? "a quiet moment"} more than usual.`;
    case "linger":
      return `Viewers lingered longer around ${input.moment ?? "your softer pacing"}.`;
    case "save":
      return "People quietly saved this work more than expected.";
    case "return":
      return "Some viewers returned quietly without needing to react.";
    default:
      return "Your work left a small trace.";
  }
}
