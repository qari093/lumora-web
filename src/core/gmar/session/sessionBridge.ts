export type SessionBridge = {
  sessionId: string;
  connected: boolean;
};

export function createSessionBridge(id: string): SessionBridge {
  return {
    sessionId: id,
    connected: true
  };
}
