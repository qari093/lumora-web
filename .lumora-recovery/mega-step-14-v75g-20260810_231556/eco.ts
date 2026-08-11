export type EcoFactors = {
  currency: string;
  co2KgPerShipment: number;
  carbonPerView: number;
  savingsMultiplier: number;
};

export function loadEcoFactors(): EcoFactors {
  return {
    currency: "EUR",
    co2KgPerShipment: 0.42,
    carbonPerView: 0.001,
    savingsMultiplier: 1,
  };
}

export function estimateFromCounts(counts: { shipments?: number; views?: number; shares?: number } = {}) {
  const factors = loadEcoFactors();
  const shipments = Number(counts.shipments ?? 0);
  const views = Number(counts.views ?? 0);
  const shares = Number(counts.shares ?? 0);

  return {
    currency: factors.currency,
    shipments,
    views,
    shares,
    estimatedCo2Kg: Math.max(0.001, shipments * factors.co2KgPerShipment + views * factors.carbonPerView),
    estimatedSavings: shares * factors.savingsMultiplier,
  };
}
