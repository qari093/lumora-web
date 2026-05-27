export type CombatResult = {
  damage: number;
  critical: boolean;
};

export function performAttack(power: number): CombatResult {
  return {
    damage: power * 2,
    critical: power > 50
  };
}
