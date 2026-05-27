import { applyFreshness } from "./freshness";
import { applyRepeatPenalty } from "./repeatPenalty";
import { applyAnomalyGuard } from "./anomaly";
import { rerankAdjust } from "./rerankAdjust";

export function applyAdjustments(items:any[]){
  let out = applyFreshness(items);
  out = applyRepeatPenalty(out);
  out = applyAnomalyGuard(out);
  out = rerankAdjust(out);
  return out;
}
