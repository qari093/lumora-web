import { attachUserProfile } from "./userProfile";
import { applySessionSignals } from "./sessionSignal";
import { applyRealtimeSignals } from "./realtimeSignal";
import { mergeBehavior } from "./behaviorMerge";

export function applyBehavior(items:any[], ctx:any){
  let out = attachUserProfile(items, ctx?.user);
  out = applySessionSignals(out, ctx?.session);
  out = applyRealtimeSignals(out, ctx?.events);
  out = mergeBehavior(out);
  return out;
}
