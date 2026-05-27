export function expandProfile(p:any){
  return {
    interests: p?.interests || {},
    sessions: p?.sessions || [],
    last_active: p?.last_active || Date.now(),
    device: p?.device || "web",
    patterns: p?.patterns || {}
  };
}
