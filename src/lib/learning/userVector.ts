export function buildUserVector(profile:any){
  const i = profile?.interests || {};
  return Object.keys(i).sort().map(k => Number(i[k]||0));
}
