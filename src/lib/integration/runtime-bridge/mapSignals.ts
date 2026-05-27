export function mapHumanSignalsToFyp(item: any, signals: any[]) {
  return {
    ...item,
    signals: signals || [],
  };
}
