export function calcScrollDepth(scrollTop:number, scrollHeight:number, clientHeight:number){
  const denom = scrollHeight - clientHeight;
  if(denom <= 0) return 0;
  return Math.max(0, Math.min(1, scrollTop / denom));
}
