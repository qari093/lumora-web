export function reqId(seed?: string): string {
  if (seed && typeof seed === "string" && seed.trim()) return seed;
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10);
  const pid = (typeof process !== "undefined" && (process as any).pid) ? (process as any).pid.toString(36) : "p";
  return `${t}-${r}-${pid}`;
}
export default reqId;
