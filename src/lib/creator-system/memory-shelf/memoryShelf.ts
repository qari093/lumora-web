export type MemoryShelfDrawer = {
  creatorId: string;
  open: boolean;
  presentation: "memory-drawer";
  contentLibraryMode: false;
};

export function buildMemoryShelfDrawer(creatorId: string, open = false): MemoryShelfDrawer {
  return {
    creatorId,
    open,
    presentation: "memory-drawer",
    contentLibraryMode: false,
  };
}
