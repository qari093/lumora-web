export function socialReady(activeRooms: number) {
  return {
    connected: activeRooms > 0
  };
}
