export function createStorageKey(input: { creatorId: string; filename: string }) {
  const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `creators/${input.creatorId}/media/${Date.now()}-${safeName}`;
}
