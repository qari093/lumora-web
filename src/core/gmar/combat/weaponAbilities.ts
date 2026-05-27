export type Ability = {
  id: string;
  power: number;
  cooldown: number;
};

export function activateAbility(ability: Ability) {
  return {
    success: true,
    energyCost: ability.power * 2
  };
}
