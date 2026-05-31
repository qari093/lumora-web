import type { ObservabilityEvent } from "./types";

export function createObservabilityEvent(input: {
  severity: ObservabilityEvent["severity"];
  message: string;
}): ObservabilityEvent {
  if (!input.message.trim()) throw new Error("message_required");

  return {
    id: `obs_lumaspace_${Date.now()}`,
    system: "lumaspace_omega",
    severity: input.severity,
    message: input.message,
  };
}
