export type SyndicationSnippet = {
  snippetId: string;
  creatorId: string;
  sourceContentId: string;
  durationSeconds: 6;
  licensed: true;
  microPayment: number;
};

export function createSyndicationSnippet(input: {
  snippetId: string;
  creatorId: string;
  sourceContentId: string;
  intensity: number;
}): SyndicationSnippet {
  if (!input.snippetId.trim() || !input.creatorId.trim() || !input.sourceContentId.trim()) {
    throw new Error("Syndication snippet requires identifiers.");
  }

  return {
    snippetId: input.snippetId,
    creatorId: input.creatorId,
    sourceContentId: input.sourceContentId,
    durationSeconds: 6,
    licensed: true,
    microPayment: Number(Math.max(0.05, input.intensity * 0.03).toFixed(2))
  };
}
