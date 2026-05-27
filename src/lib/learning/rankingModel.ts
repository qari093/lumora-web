import { baselinePredict } from "./baselineModel";

export function scoreItems(items:any[]){
  return (items||[]).map(x => ({
    ...x,
    model_score: baselinePredict(x.x||[])
  }));
}
