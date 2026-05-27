export function canShareAsMemory(input: {
  requesterId: string;
  creatorId: string;
}): boolean {
  return input.requesterId === input.creatorId;
}
