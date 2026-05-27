export function addFullMemoryTransition(memoryId?: string) {
  return { visible: Boolean(memoryId), text: "See full memory?", href: memoryId ? `/memory/${memoryId}` : "" };
}
