export type MemoryAnchor = {
  id: string;
  momentId: string;
  note: string;
  permanent: true;
  emotionalWeight: number;
};

export function createMemoryAnchor(momentId: string, note = ""): MemoryAnchor {
  if (!momentId.trim()) throw new Error("moment_id_required");

  return {
    id: `anchor_${momentId}`,
    momentId,
    note: note.trim().slice(0, 240),
    permanent: true,
    emotionalWeight: Math.min(100, 40 + note.trim().length)
  };
}
