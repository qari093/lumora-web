import fs from "fs";
import path from "path";

export const dynamic="force-dynamic";

function latest(dir:string){
  if(!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir).sort().reverse()[0]||null;
}

export async function GET(req:Request){
  const url = new URL(req.url);
  const prefer = url.searchParams.get("prefer") || "rss";

  const dir = path.join(process.cwd(),"data/live_ranked");
  const file = latest(dir);
  if(!file){
    return Response.json({ok:true,live_status:"not_live",proof_status:"failed",data:[]});
  }

  const ranked = JSON.parse(fs.readFileSync(path.join(dir,file),"utf-8"));

  const preferred = ranked.filter((x:any)=>x.source===prefer);
  const rest = ranked.filter((x:any)=>x.source!==prefer);

  const feed = [...preferred,...rest].slice(0,20);

  return Response.json({
    ok:true,
    live_status:feed.length?"candidate_live":"not_live",
    proof_status:feed.length?"pending":"failed",
    source_of_truth:"filesystem",
    data:{prefer,count:feed.length,feed},
    ts:Date.now()
  });
}
