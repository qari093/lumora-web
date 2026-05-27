export function classifyMedia(x:any){
  if(x.media_url?.includes("youtube")) return "youtube";
  if(x.media_url?.endsWith(".mp4")) return "video";
  return "embed";
}

export function classifyBatch(items:any[]){
  return items.map(x => ({
    ...x,
    media_type: x.media_type || classifyMedia(x)
  }));
}
