export type Pulse = { userId?: string; ts: string; message: string; meta?: any };
let last: Pulse = { ts: new Date().toISOString(), message: "pulse:init" };
export function applyPulseAction(a:{userId?:string;message?:string;meta?:any}) {
  last = { userId: a.userId, ts: new Date().toISOString(), message: a.message ?? "pulse:action", meta: a.meta };
  return { ok: true, pulse: last };
}
export function globalPulseEvent() { return last; }
export function getPulseState(userId: string) { return { ok: true, userId, current: globalPulseEvent() }; }
