export function calculateLegacyBonus(input: {
  accountAgeDays: number;
  positiveContributionDays: number;
}) {
  const ageBonus = Math.min(0.05, input.accountAgeDays / 3650);
  const contributionBonus = Math.min(0.05, input.positiveContributionDays / 3650);

  return Number((ageBonus + contributionBonus).toFixed(4));
}
