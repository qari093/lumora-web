export function entropyShuffle(items:any[]){
  return items
    .map(x=>({...x,_r:Math.random()}))
    .sort((a,b)=>b._r-a._r)
    .map(({_r,...rest})=>rest);
}
