export function injectTraceSummaryIntoDashboard(dashboard: any, traceSummary: any) {
  return {
    ...dashboard,
    traceSummary: {
      visible: true,
      interpretationText: false,
      ...traceSummary,
    },
  };
}
