import { createMonetizationPulseMetrics, MonetizationPulseMetrics } from "./metrics";
import { trackRevenue } from "./revenue";
import { buildCreatorStats } from "./creatorStats";
import { buildAdPerformance } from "./adPerformance";

export function buildMonetizationPulseDashboard(input: {
  metrics: MonetizationPulseMetrics;
  revenue: {
    adRevenue: number;
    zenSpendRevenue: number;
    creatorCost: number;
  };
  creators: {
    creatorCount: number;
    payoutTotal: number;
    eligibleCreators: number;
  };
  ads: {
    impressions: number;
    engagements: number;
    conversions: number;
    revenue: number;
  };
}) {
  const metrics = createMonetizationPulseMetrics(input.metrics);
  const revenue = trackRevenue(input.revenue);
  const creators = buildCreatorStats(input.creators);
  const ads = buildAdPerformance(input.ads);

  return {
    ok: metrics.healthy && revenue.gross >= 0 && ads.impressions >= 0,
    metrics,
    revenue,
    creators,
    ads,
  };
}
