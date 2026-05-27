export type ExternalMemoryPage = {
  memoryId: string;
  creatorId: string;
  title: string;
  roomMood: string;
  publicUrl: string;
  countsHidden: true;
  commentsHidden: true;
};

export function generateExternalMemoryPage(input: {
  memoryId: string;
  creatorId: string;
  title?: string;
  roomMood: string;
}): ExternalMemoryPage {
  return {
    memoryId: input.memoryId,
    creatorId: input.creatorId,
    title: input.title || "A Lumora Memory",
    roomMood: input.roomMood,
    publicUrl: `/memory/${input.memoryId}`,
    countsHidden: true,
    commentsHidden: true,
  };
}
