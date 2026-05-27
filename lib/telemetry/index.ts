export type RuntimeMetric = {
  name: string;
  value: number;
  ts: number;
};

export function metric(
  name: string,
  value = 1
): RuntimeMetric {
  return {
    name,
    value,
    ts: Date.now()
  };
}

export default {
  metric
};
