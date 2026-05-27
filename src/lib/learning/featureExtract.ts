export function extractFeatures(item:any, profile:any){
  return {
    topic: item?.topic || "general",
    media_type: item?.media_type || "embed",
    source: item?.source || "unknown",
    user_state: profile?.state || "low",
    score: item?.final_score || 0
  };
}
