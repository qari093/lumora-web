export function inferIntent(seq:string[]){
  const counts:any = {};
  for(const s of seq){
    counts[s] = (counts[s] || 0) + 1;
  }
  if((counts.watch || 0) > (counts.skip || 0)) return "consume";
  if((counts.skip || 0) > (counts.watch || 0)) return "avoid";
  return "neutral";
}
