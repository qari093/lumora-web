import { loadFeedback } from "./feedbackStore";

export function applyFeedback(items:any[]){
  const fb = loadFeedback();

  const map:any = {};
  for(const f of fb){
    if(!map[f.id]) map[f.id]=0;
    if(f.action==="like") map[f.id]+=2;
    if(f.action==="skip") map[f.id]-=1;
  }

  return items.map(x=>({
    ...x,
    final_score: (x.final_score||0) + (map[x.id]||0)
  }));
}
