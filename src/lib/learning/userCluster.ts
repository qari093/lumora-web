export function detectUserCluster(profile:any){
  const interests = profile?.interests || {};
  const watch = interests.watch || 0;
  const skip = interests.skip || 0;

  if (watch >= skip * 2) return "engaged";
  if (skip > watch) return "avoidant";
  return "balanced";
}
