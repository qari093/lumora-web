export type SharedMemorySilhouette = {
  id: string;
  anonymous: true;
};

export function buildSharedMemoryPresentation(input: {
  witnessIds: string[];
  roomMood: string;
}) {
  return {
    roomMood: input.roomMood,
    silhouettes: Array.from(new Set(input.witnessIds)).map((id) => ({
      id: `shared-silhouette-${id}`,
      anonymous: true as const,
    })),
    profileLinksHidden: true,
  };
}
