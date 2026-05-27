export function convertEURToApproxLocal(eur: number, rate: number) {
  return Number((eur * rate).toFixed(2));
}

export function getDCCWarning() {
  return "Always pay in EUR to avoid poor exchange rates.";
}
