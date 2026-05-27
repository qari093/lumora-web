import { enforceDeterminism } from "./deterministic";
import { checkConsistency } from "./consistency";
import { verifyRanking } from "./verifyRanking";

export function applyValidation(items:any[]){
  const out = enforceDeterminism(items);
  return {
    items: out,
    valid: checkConsistency(out),
    ranked: verifyRanking(out)
  };
}
