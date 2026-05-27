import type {
  LegendaryCreator,
  LegendaryRelicContract
} from "../legendary/types";

export function createLegendaryRelicContract(
  creator: LegendaryCreator
): LegendaryRelicContract {
  if (!creator.eligible) {
    throw new Error("Creator not eligible for legendary contract.");
  }

  return {
    contractId: `legendary_contract_${creator.creatorId}`,
    creatorId: creator.creatorId,
    productionBudget: 25000,
    revenueSharePercent: 70,
    active: true
  };
}
