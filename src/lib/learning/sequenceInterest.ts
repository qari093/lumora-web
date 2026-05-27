export function extractSequenceInterest(seq:string[]){
  const out:any = {};
  for(const s of seq||[]){
    out[s] = (out[s]||0) + 1;
  }
  return out;
}
