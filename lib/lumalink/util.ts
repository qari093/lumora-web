export function safeStr(v: any): string {
  return String(v ?? "").trim().slice(0, 80);
}
export function shortId(): string {
  const a = Math.floor(Date.now() / 1000).toString(36).slice(-4);
  const b = Math.floor(Math.random() * 2176782336).toString(36).slice(0, 4);
  return (a + b).replace(/[^a-z0-9]/gi, "").slice(0, 7);
}
