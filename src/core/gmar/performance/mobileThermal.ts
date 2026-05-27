export function thermalProtection(temp: number) {
  return {
    throttled: temp > 42
  };
}
