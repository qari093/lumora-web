export function applyDiversityConstraint(items:any[]){
  const seen = new Set<string>();
  return (items || []).filter((x:any) => {
    const key = x.topic || x.media_type || "general";
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
