export const lumenRuntime = {
  morningOracle: true,
  gentleNo: true,
  oneMinuteAnchor: true
};

export function lumenHealthy() {
  return Object.values(lumenRuntime).every(Boolean);
}
