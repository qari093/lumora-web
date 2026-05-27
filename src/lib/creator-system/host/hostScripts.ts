export type HostScriptPhase = "opening" | "closing";

export function getHostScript(phase: HostScriptPhase): string {
  if (phase === "opening") {
    return "Welcome. We are here to witness quietly. No ranking, no judgment, only presence.";
  }

  return "This circle is complete. Carry only what felt human. The room now dissolves calmly.";
}
