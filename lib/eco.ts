export type EcoFactors = {
  CO2_VIEW: number; CO2_HOVER: number; CO2_CLICK: number; CO2_CONV: number;
  WH_VIEW: number;  WH_HOVER: number;  WH_CLICK: number;  WH_CONV: number;
  CO2_PER_CENT_SPEND: number;
};

export function loadEcoFactors(): EcoFactors {
  const n = (k: string, d: number) => {
    const v = process.env[k];
    const f = v != null ? Number(v) : NaN;
    return Number.isFinite(f) ? f : d;
  };
  return {
    CO2_VIEW: n("ECO_CO2_G_PER_VIEW", 0.2),
    CO2_HOVER: n("ECO_CO2_G_PER_HOVER", 0.05),
    CO2_CLICK: n("ECO_CO2_G_PER_CLICK", 0.4),
    CO2_CONV: n("ECO_CO2_G_PER_CONV", 1.0),
    WH_VIEW: n("ECO_WH_PER_VIEW", 0.8),
    WH_HOVER: n("ECO_WH_PER_HOVER", 0.2),
    WH_CLICK: n("ECO_WH_PER_CLICK", 1.5),
    WH_CONV: n("ECO_WH_PER_CONV", 3.0),
    CO2_PER_CENT_SPEND: n("ECO_CO2_G_PER_CENT_SPEND", 0),
  };
}

export function estimateFromCounts(f: EcoFactors, counts: {views:number;hovers:number;clicks:number;conversions:number;spendCents:number}) {
  const co2g = (
    counts.views * f.CO2_VIEW +
    counts.hovers * f.CO2_HOVER +
    counts.clicks * f.CO2_CLICK +
    counts.conversions * f.CO2_CONV +
    counts.spendCents * f.CO2_PER_CENT_SPEND
  );
  const energyWh = (
    counts.views * f.WH_VIEW +
    counts.hovers * f.WH_HOVER +
    counts.clicks * f.WH_CLICK +
    counts.conversions * f.WH_CONV
  );
  return { co2g, energyWh };
}

export function treesEquivalentKg(co2g: number) {
  // playful: 6 kg CO2 / tree / month equivalent → show rough trees offset for period
  const kg = co2g / 1000;
  const trees = kg / 6;
  return { kg, trees };
}
