import https from "https";

function fetchHTML(url:string):Promise<string>{
  return new Promise((resolve,reject)=>{
    https.get(url,(res)=>{
      let data="";
      res.on("data",(chunk)=>data+=chunk);
      res.on("end",()=>resolve(data));
    }).on("error",reject);
  });
}

function extractMeta(html:string){
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const descMatch = html.match(/<meta name="description" content="(.*?)"/i);

  return {
    title: titleMatch ? titleMatch[1] : "untitled",
    description: descMatch ? descMatch[1] : "",
  };
}

export async function crawlURL(url:string){
  try{
    const html = await fetchHTML(url);
    const meta = extractMeta(html);

    return {
      id: Buffer.from(url).toString("base64"),
      url,
      title: meta.title,
      description: meta.description,
      source: "crawler",
      topic: "general",
      media_type: "embed",
      ts: Date.now()
    };
  }catch{
    return null;
  }
}
