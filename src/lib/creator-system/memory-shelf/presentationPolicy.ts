export type MemoryShelfPresentationPolicy = {
  contentLibraryPresentationAllowed: false;
  gridRankingAllowed: false;
  chronologicalMemoryFlow: true;
  reason: "memory_not_content_library";
};

export function getMemoryShelfPresentationPolicy(): MemoryShelfPresentationPolicy {
  return {
    contentLibraryPresentationAllowed: false,
    gridRankingAllowed: false,
    chronologicalMemoryFlow: true,
    reason: "memory_not_content_library",
  };
}
