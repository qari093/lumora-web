export function buildUserEmbedding(profile:any){
  const interests = profile?.interests || {};
  return Object.keys(interests)
    .sort()
    .map(k => Number(interests[k] || 0));
}
