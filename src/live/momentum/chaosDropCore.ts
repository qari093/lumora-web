export type ChaosDrop = {
  id: string;
  prompt: string;
  durationMinutes: number;
  searchable: false;
};

export function createChaosDrop(id: string, prompt: string): ChaosDrop {
  return {
    id,
    prompt,
    durationMinutes: 5,
    searchable: false,
  };
}
