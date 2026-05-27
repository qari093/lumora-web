import { applyFallback } from "./fallback";
import { validateResponse } from "./responseValidate";

export function applySafety(items:any[]){
  let out = validateResponse(items);
  out = applyFallback(out);
  return out;
}
