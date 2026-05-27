export function thermalGuard(temp: number) {
  return {
    safe: temp < 45
  };
}
