export type Boss = {
  id: string;
  phase: number;
  hp: number;
};

export function createBoss(id: string): Boss {
  return {
    id,
    phase: 1,
    hp: 5000
  };
}
