export function createContentFingerprint(input: { contentId: string; hash: string }) {
  return {
    ...input,
    registeredAt: new Date().toISOString(),
  };
}
