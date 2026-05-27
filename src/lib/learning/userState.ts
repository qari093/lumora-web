export function classifyUserState(profile:any){
  const interests = profile?.interests || {};
  const total = Object.values(interests).reduce((a:any,b:any)=>a+b,0);

  if(total > 50) return "high_engagement";
  if(total > 10) return "medium_engagement";
  return "low_engagement";
}
