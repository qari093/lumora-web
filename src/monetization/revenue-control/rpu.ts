export function calculateRevenuePerUser(input: {
  totalRevenue: number;
  activeUsers: number;
}) {
  if (input.activeUsers <= 0) return 0;
  return Number((input.totalRevenue / input.activeUsers).toFixed(4));
}
