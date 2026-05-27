export function trackLinkEvent(input: { linkId: string; event: string }) {
  return {
    ...input,
    trackedAt: new Date().toISOString(),
  };
}
