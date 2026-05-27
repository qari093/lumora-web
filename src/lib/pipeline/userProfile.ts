export function attachUserProfile(items:any[], user:any){
  return (items || []).map(x => ({
    ...x,
    user_profile: user || {}
  }));
}
