export function createTermsAcceptance(input: { userId: string; document: string; version: string }) {
  return {
    ...input,
    acceptedAt: new Date().toISOString(),
  };
}
