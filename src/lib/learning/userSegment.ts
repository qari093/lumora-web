export function segmentUser(profile:any){
  const interests = profile?.interests || {};
  const total = Object.values(interests).reduce<number>((a, b) => a + Number(b || 0), 0);

  if(total >= 20) return "power";
  if(total >= 5) return "active";
  return "new";
}
