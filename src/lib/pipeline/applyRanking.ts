import { applySemanticScore } from "./semanticHook";
import { applyModelScore } from "./modelHook";
import { mergeScores } from "./mergeScores";
import { rankItems } from "./rank";

export function applyRanking(items:any[]){
  let out = applySemanticScore(items);
  out = applyModelScore(out);
  out = mergeScores(out);
  out = rankItems(out);
  return out;
}
