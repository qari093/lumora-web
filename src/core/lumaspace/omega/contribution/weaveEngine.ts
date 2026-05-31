import type { WeaveThread } from "./types";

export function createWeaveThread(input: {
  id: string;
  sourceId: string;
  sourceOwnerId: string;
  wovenBy: string;
  destinationSpaceId: string;
}): WeaveThread {
  if (!input.id.trim()) throw new Error("weave_id_required");
  if (!input.sourceId.trim()) throw new Error("sourceId_required");
  if (!input.destinationSpaceId.trim()) throw new Error("destinationSpaceId_required");

  return {
    ...input,
    attributionPreserved: true,
    gratitudeThread: input.sourceOwnerId !== input.wovenBy,
  };
}
