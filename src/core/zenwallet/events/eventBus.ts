export type WalletEvent = {
  type: string;
  timestamp: string;
  payload?: unknown;
};

const events: WalletEvent[] = [];

export function emitWalletEvent(type: string, payload?: unknown) {
  events.push({
    type,
    payload,
    timestamp: new Date().toISOString(),
  });
}

export function getWalletEvents() {
  return events;
}
