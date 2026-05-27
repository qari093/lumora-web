export type RemixChain = {
  remixId: string;
  sourceContentId: string;
  remixerId: string;
  active: boolean;
};

export function createRemixChain(input: {
  sourceContentId: string;
  remixerId: string;
}): RemixChain {
  if (
    !input.sourceContentId.trim() ||
    !input.remixerId.trim()
  ) {
    throw new Error("Remix chain requires source content and remixer.");
  }

  return {
    remixId: `remix_${Date.now()}`,
    sourceContentId: input.sourceContentId,
    remixerId: input.remixerId,
    active: true
  };
}
