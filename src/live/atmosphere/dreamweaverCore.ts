export type DreamweaverCanvas = {
  id: string;
  monthKey: string;
  persistent: true;
  contributorCount: number;
};

export function canSealDreamweaverCanvas(contributorCount: number): boolean {
  return contributorCount >= 5;
}
