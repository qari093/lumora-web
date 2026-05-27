export function enableCreatorOnlyShare(input: {
  requesterId: string;
  creatorId: string;
  memoryId: string;
}) {
  const allowed = input.requesterId === input.creatorId;
  return { allowed, memoryId: input.memoryId };
}
