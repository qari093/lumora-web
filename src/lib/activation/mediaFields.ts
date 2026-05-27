export function enrichMediaFields(items:any[]){
  return items.map(x=>{
    let media_url = x.media_url || null;
    let thumb_url = x.thumb_url || null;

    // basic mapping (temporary bridge)
    if(!media_url){
      if(x.source === "reddit" && x.url){
        media_url = x.url;
      }
      if(x.source === "rss"){
        media_url = null;
      }
    }

    if(!thumb_url){
      thumb_url = "https://placehold.co/600x400?text=Lumora";
    }

    return {
      ...x,
      media_url,
      thumb_url,
      media_type: media_url ? "video" : "placeholder"
    };
  });
}
