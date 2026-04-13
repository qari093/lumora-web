export type NarrativeTemplateType = "breaking" | "trailer" | "reaction" | "calm";

export function renderNarrativeTemplate(
  type: NarrativeTemplateType,
  input: { title: string; summary?: string }
): string {
  switch (type) {
    case "breaking":
      return `${input.title} — ${input.summary || "Signal rising now."}`;
    case "trailer":
      return `Now showing: ${input.title}. ${input.summary || "Trailer event live."}`;
    case "reaction":
      return `The crowd noticed this: ${input.title}. ${input.summary || ""}`.trim();
    case "calm":
      return `${input.title}. ${input.summary || "Take a breath and watch."}`;
    default:
      return input.title;
  }
}
