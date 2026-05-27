export function applyQualityFilter(items:any[]){
  return items.filter(x=>{
    if(!x.title) return false;
    if(x.title.length < 5) return false;
    return true;
  });
}
