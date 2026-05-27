import { applySourceWeight } from "./sourceWeight";
import { applyGeoSignal } from "./geoSignal";
import { applyLangSignal } from "./langSignal";
import { applyCategorySignal } from "./categorySignal";

export function applyContextSignals(items:any[], ctx:any={}){
  let out = applySourceWeight(items);
  out = applyGeoSignal(out, ctx.geo || "global");
  out = applyLangSignal(out, ctx.lang || "en");
  out = applyCategorySignal(out, ctx.categories || []);

  return out.map((x:any) => ({
    ...x,
    final_score: Number(x.final_score || 0)
      + Number(x.geo_score || 0)
      + Number(x.lang_score || 0)
      + Number(x.category_score || 0)
  }));
}
