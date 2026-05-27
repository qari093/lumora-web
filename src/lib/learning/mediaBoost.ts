export function applyMediaPreference(items:any[], prefs:any){
  return items.map((x:any) => {
    const boost = prefs[x.media_type] || 0;
    return { ...x, final_score: (x.final_score || 0) + boost };
  });
}
