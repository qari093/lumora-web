export function validateRuntimeBridge(input: any) {
  return {
    ok: Boolean(input.creatorId && input.videoId),
  };
}
