export function buildHumanSignalOverlay(signals: any[] = []) {
  return {
    visible: signals.length > 0,
    signals,
    showCounts: false,
    interpretationText: false,
  };
}
