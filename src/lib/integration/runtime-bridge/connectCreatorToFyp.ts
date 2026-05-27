export function connectCreatorToFypRuntime(input: {
  creatorId: string;
  videoId: string;
}) {
  return {
    connected: true,
    creatorId: input.creatorId,
    videoId: input.videoId,
  };
}
