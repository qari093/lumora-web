export function subscriptionBudget(activeRooms: number) {
  return {
    withinBudget: activeRooms <= 3,
    activeRooms
  };
}
