export function injectMomentCardIntoDashboard(dashboard: any, momentCard: any) {
  return {
    ...dashboard,
    yourMomentCard: {
      visible: Boolean(momentCard),
      interpretationText: false,
      ...momentCard,
    },
  };
}
