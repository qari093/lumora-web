import type { ZenEconomyAsset } from "./types";

export interface CreatorUtilityItem {
  id: string;
  asset: ZenEconomyAsset;
  cost: number;
  payToWin: false;
}

export function createCreatorUtilityItem(input: {
  id: string;
  asset: ZenEconomyAsset;
  cost: number;
}): CreatorUtilityItem {
  return {
    id: input.id,
    asset: input.asset,
    cost: Math.max(0, input.cost),
    payToWin: false
  };
}

export function validateCreatorUtilityItem(item: CreatorUtilityItem): boolean {
  return item.cost >= 0 && item.payToWin === false;
}
