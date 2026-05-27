import { getSignals } from "./runtimeStore";

export async function deriveDashboardState() {
  const signals = await getSignals();

  const present = signals.filter((s) => s.type === "present").length;
  const hold = signals.filter((s) => s.type === "hold").length;
  const rewatch = signals.filter((s) => s.type === "rewatch").length;

  return {
    hasActivity: signals.length > 0,
    totalSignals: signals.length,
    summary: `${present} present, ${hold} held, ${rewatch} returned`,
    strongestMoment: signals[signals.length - 1] || null,
  };
}
