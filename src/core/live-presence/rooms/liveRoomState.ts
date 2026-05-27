export function liveRoomState(id: string) {
  return {
    id,
    alive: true,
    viewers: 0
  };
}
