import { loadBehavior } from "./userBehavior";

export function applyBehaviorBoost(items:any[],userId:string){
  const behavior = loadBehavior(userId);

  return items.map(x=>{
    if(behavior[x.id]?.liked){
      return {...x, final_score:(x.final_score||1)*1.3};
    }
    return x;
  });
}
