export type WorldEvent = {
  id: string;
  active: boolean;
};

export function launchWorldEvent(id: string): WorldEvent {
  return {
    id,
    active: true
  };
}
