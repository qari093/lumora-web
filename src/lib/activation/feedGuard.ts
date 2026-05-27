export function applyFeedGuard(items:any[]){
  return items.filter(x=>{
    if(!x.id) return false;
    if(!x.title) return false;
    if((x.final_score||0) <= 0) return false;
    return true;
  });
}
