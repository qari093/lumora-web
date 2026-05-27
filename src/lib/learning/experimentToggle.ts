export function isExperimentEnabled(flag:string){
  const flags:any = {
    rerank_v2: true,
    explore_boost: true
  };
  return !!flags[flag];
}
