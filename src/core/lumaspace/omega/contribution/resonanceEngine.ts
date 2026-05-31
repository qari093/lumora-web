import type { ResonanceEcho } from "./types";

export function createResonanceEcho(input: {
  id: string;
  sourceId: string;
  authorId: string;
  format: ResonanceEcho["format"];
  body: string;
}): ResonanceEcho {
  if (!input.id.trim()) throw new Error("resonance_id_required");
  if (!input.sourceId.trim()) throw new Error("sourceId_required");
  if (!input.authorId.trim()) throw new Error("authorId_required");

  return {
    ...input,
    thoughtful: input.body.trim().length >= 12,
  };
}

export function canAttachResonance(echo: ResonanceEcho): boolean {
  return echo.thoughtful;
}
