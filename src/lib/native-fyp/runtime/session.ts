export function createSessionId() {
  return "sess_" + Math.random().toString(36).slice(2);
}
