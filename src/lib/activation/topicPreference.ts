import { loadBehavior } from "./userBehavior";

export function applyTopicPreference(items:any[],userId:string){
  const behavior = loadBehavior(userId);

  const topicCount:any = {};
  for(const k in behavior){
    const t = behavior[k]?.topic;
    if(t) topicCount[t] = (topicCount[t]||0)+1;
  }

  return items.map(x=>{
    const boost = topicCount[x.topic] ? 1 + (topicCount[x.topic]*0.05) : 1;
    return {...x, final_score:(x.final_score||1)*boost};
  });
}
