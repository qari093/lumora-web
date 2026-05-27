export type CharacterRig = {
  id: string;
  bones: number;
};

export function createRig(id: string): CharacterRig {
  return {
    id,
    bones: 32
  };
}
