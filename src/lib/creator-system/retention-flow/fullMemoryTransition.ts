export type FullMemoryTransition = {
  visible: boolean;
  text: "See full memory?";
  targetUrl: string;
};

export function buildFullMemoryTransition(memoryId?: string): FullMemoryTransition {
  return {
    visible: Boolean(memoryId),
    text: "See full memory?",
    targetUrl: memoryId ? `/memory/${memoryId}` : "",
  };
}
