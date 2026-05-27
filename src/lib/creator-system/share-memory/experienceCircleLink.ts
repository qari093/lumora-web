export function buildExperienceCircleEntryLink(memoryId: string): string {
  return `/creator/first-breath?fromMemory=${encodeURIComponent(memoryId)}`;
}
