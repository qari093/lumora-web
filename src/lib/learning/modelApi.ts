import { scoreItems } from "./rankingModel";

export function runModel(data:any[]){
  return scoreItems(data);
}
