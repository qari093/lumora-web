export function handleColdStart(profile:any, items:any[]){
  if(!profile || !profile.interests || Object.keys(profile.interests).length === 0){
    return (items || []).slice(0,20);
  }
  return items;
}
