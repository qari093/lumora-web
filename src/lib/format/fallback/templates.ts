export type FallbackTemplate = {
  id: string;
  type: "safe" | "empty" | "processing";
  title: string;
  body: string;
};

export function getFallbackTemplates(): FallbackTemplate[] {
  return [
    { id: "safe_1", type: "safe", title: "Safe content", body: "Protected fallback content." },
    { id: "empty_1", type: "empty", title: "No content yet", body: "Signals are loading." },
    { id: "proc_1", type: "processing", title: "Processing", body: "Scoring and safety checks running." }
  ];
}
