export type RoiInput = {
  revenue: number;
  cost: number;
};

export type RoiResult = {
  revenue: number;
  cost: number;
  roi: number;
  profitable: boolean;
};

export function calculateRoi(input: RoiInput): RoiResult {
  const revenue = Math.max(0, Number(input.revenue ?? 0));
  const cost = Math.max(0, Number(input.cost ?? 0));

  if (cost === 0) {
    return {
      revenue,
      cost,
      roi: revenue > 0 ? 1 : 0,
      profitable: revenue > 0,
    };
  }

  const roi = Number(((revenue - cost) / cost).toFixed(4));

  return {
    revenue,
    cost,
    roi,
    profitable: revenue >= cost,
  };
}
