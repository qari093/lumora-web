export function syncPresence(viewers: number, reactions: number) {
  return {
    synchronized: true,
    viewers,
    reactions,
    pulseRate: viewers > 0 ? reactions / viewers : 0
  };
}
