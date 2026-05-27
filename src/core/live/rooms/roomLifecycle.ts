export type LiveRoomState = {
  id: string;
  active: boolean;
  viewers: number;
};

export function createRoom(id: string): LiveRoomState {
  return {
    id,
    active: true,
    viewers: 0
  };
}
