import { buildUserVector } from "./userVector";
import { buildItemVector } from "./itemVector";
import { normalizeVector } from "./featureNormalize";

export function buildDataset(profile:any, items:any[]){
  const u = normalizeVector(buildUserVector(profile));
  return (items||[]).map(item => ({
    x: [...u, ...normalizeVector(buildItemVector(item))],
    y: Number(item?.final_score||0)
  }));
}
