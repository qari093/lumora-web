export type Campaign = {
  campaignId: string;
  advertiserId: string;
  budgetZen: number;
  dailyBudgetZen: number;
};

export function createCampaign(input: Campaign) {
  return {
    ...input,
    valid:
      input.budgetZen > 0 &&
      input.dailyBudgetZen > 0 &&
      input.dailyBudgetZen <= input.budgetZen,
  };
}
