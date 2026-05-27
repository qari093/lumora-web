import { applyDiversity } from "./diversity";
import { applyExploration } from "./exploration";
import { rerank } from "./rerank";

export function diverseExplore(items:any[]){
  let out = applyDiversity(items);
  out = applyExploration(out);
  out = rerank(out);
  return out;
}
