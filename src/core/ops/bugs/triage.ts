export type BugSeverity = "critical" | "high" | "medium" | "low";

export function triageBug(input: { title: string; severity: BugSeverity }) {
  return {
    ...input,
    blocker: input.severity === "critical" || input.severity === "high",
    triagedAt: new Date().toISOString(),
  };
}
