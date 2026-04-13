export function createRequestId(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `lumora_${Date.now()}_${rand}`;
}
