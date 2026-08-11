export type EcoFactors = {
  currency: string;
  co2KgPerShipment: number;
  carbonPerView: number;
  savingsMultiplier: number;
  CO2_VIEW: number;
  CO2_HOVER: number;
  CO2_CLICK: number;
  CO2_CONV: number;
  WH_VIEW: number;
  WH_HOVER: number;
  WH_CLICK: number;
  WH_CONV: number;
  CO2_PER_CENT_SPEND: number;
};

export type EcoSustainabilityCounts = {
  shipments?: number;
  views?: number;
  shares?: number;
};

export type EcoEngagementCounts = {
  views: number;
  hovers: number;
  clicks: number;
  conversions: number;
  spendCents: number;
};

export type EcoSustainabilityEstimate = {
  currency: string;
  shipments: number;
  views: number;
  shares: number;
  estimatedCo2Kg: number;
  estimatedSavings: number;
};

export type EcoEngagementEstimate = {
  co2g: number;
  energyWh: number;
};

function envNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  const parsed = raw != null ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadEcoFactors(): EcoFactors {
  return {
    currency: 'EUR',
    co2KgPerShipment: 0.42,
    carbonPerView: 0.001,
    savingsMultiplier: 1,
    CO2_VIEW: envNumber('ECO_CO2_G_PER_VIEW', 0.2),
    CO2_HOVER: envNumber('ECO_CO2_G_PER_HOVER', 0.05),
    CO2_CLICK: envNumber('ECO_CO2_G_PER_CLICK', 0.4),
    CO2_CONV: envNumber('ECO_CO2_G_PER_CONV', 1.0),
    WH_VIEW: envNumber('ECO_WH_PER_VIEW', 0.8),
    WH_HOVER: envNumber('ECO_WH_PER_HOVER', 0.2),
    WH_CLICK: envNumber('ECO_WH_PER_CLICK', 1.5),
    WH_CONV: envNumber('ECO_WH_PER_CONV', 3.0),
    CO2_PER_CENT_SPEND: envNumber('ECO_CO2_G_PER_CENT_SPEND', 0),
  };
}

export function estimateFromCounts(counts?: EcoSustainabilityCounts): EcoSustainabilityEstimate;
export function estimateFromCounts(
  factors: EcoFactors,
  counts: EcoEngagementCounts,
): EcoEngagementEstimate;
export function estimateFromCounts(
  first: EcoSustainabilityCounts | EcoFactors = {},
  second?: EcoEngagementCounts,
): EcoSustainabilityEstimate | EcoEngagementEstimate {
  if (second) {
    const factors = first as EcoFactors;
    const counts = second;

    const co2g =
      counts.views * factors.CO2_VIEW +
      counts.hovers * factors.CO2_HOVER +
      counts.clicks * factors.CO2_CLICK +
      counts.conversions * factors.CO2_CONV +
      counts.spendCents * factors.CO2_PER_CENT_SPEND;

    const energyWh =
      counts.views * factors.WH_VIEW +
      counts.hovers * factors.WH_HOVER +
      counts.clicks * factors.WH_CLICK +
      counts.conversions * factors.WH_CONV;

    return { co2g, energyWh };
  }

  const counts = first as EcoSustainabilityCounts;
  const factors = loadEcoFactors();
  const shipments = Number(counts.shipments ?? 0);
  const views = Number(counts.views ?? 0);
  const shares = Number(counts.shares ?? 0);

  return {
    currency: factors.currency,
    shipments,
    views,
    shares,
    estimatedCo2Kg: Math.max(
      0.001,
      shipments * factors.co2KgPerShipment + views * factors.carbonPerView,
    ),
    estimatedSavings: shares * factors.savingsMultiplier,
  };
}

export function treesEquivalentKg(co2g: number): {
  kg: number;
  trees: number;
} {
  const kg = co2g / 1000;
  const trees = kg / 6;
  return { kg, trees };
}
