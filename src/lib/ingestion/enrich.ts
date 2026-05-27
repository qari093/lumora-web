export function enrichMetadata(x:any){
  return {
    ...x,
    length: (x.title || "").length,
    hasMedia: !!x.media_url,
    quality: (x.title && x.title.length > 20) ? 1 : 0
  };
}

export function enrichBatch(items:any[]){
  return items.map(enrichMetadata);
}
