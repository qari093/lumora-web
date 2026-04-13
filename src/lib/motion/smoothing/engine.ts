export function smoothMotionSeries(values: number[], alpha = 0.35): number[] {
  if (!Array.isArray(values) || values.length === 0) return [];
  const out: number[] = [values[0]];
  for (let i = 1; i < values.length; i++) {
    out.push(Number((alpha * values[i] + (1 - alpha) * out[i - 1]).toFixed(4)));
  }
  return out;
}
