export type MemorySlot = {
  id: string | null;
};

export type MemoryState = {
  prev: MemorySlot;
  current: MemorySlot;
  next: MemorySlot;
};

export function createInitialMemory(): MemoryState {
  return {
    prev: { id: null },
    current: { id: null },
    next: { id: null },
  };
}

export function updateMemory(
  state: MemoryState,
  prevId: string | null,
  currentId: string,
  nextId: string | null
): MemoryState {
  return {
    prev: { id: prevId },
    current: { id: currentId },
    next: { id: nextId },
  };
}
