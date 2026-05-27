export function detectDrift(prev:any, curr:any){
  const keys = new Set([...Object.keys(prev||{}), ...Object.keys(curr||{})]);
  let diff = 0;

  for(const k of keys){
    diff += Math.abs((prev?.[k]||0) - (curr?.[k]||0));
  }

  return diff;
}
