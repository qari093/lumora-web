export function semanticTopic(item:any){
  if(item.topic && item.topic !== "general") return item.topic;
  return item.media_type || item.source || "general";
}
