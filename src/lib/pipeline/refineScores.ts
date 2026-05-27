import { applyBoostCap } from "./boostCap";
import { applyTimeDecay } from "./timeDecay";
import { normalizeScores } from "./normalizeScore";
import { stabilizeRanks } from "./stabilize";

export function refineScores(items:any[]){
  let out = applyBoostCap(items);
  out = applyTimeDecay(out);
  out = normalizeScores(out);
  out = stabilizeRanks(out);
  return out;
}
