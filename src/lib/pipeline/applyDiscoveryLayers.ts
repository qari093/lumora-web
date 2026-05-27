import { applyRanking } from "./applyRanking";
import { diverseExplore } from "./diverseExplore";

export function applyDiscoveryLayers(items:any[]){
  let out = applyRanking(items);
  out = diverseExplore(out);
  return out;
}
