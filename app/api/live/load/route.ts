import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function latest(dir:string){
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).sort().reverse();
  return files[0] || null;
}

export async function GET(){
  const dir = path.join(process.cwd(),"data","live_ingestion_raw");
  const file = latest(dir);

  if (!file){
    return Response.json({
      ok:true,
      live_status:"not_live",
      proof_status:"failed",
      source_of_truth:"filesystem",
      data:null,
      ts:Date.now()
    });
  }

  const content = fs.readFileSync(path.join(dir,file),"utf-8");

  return Response.json({
    ok:true,
    live_status:"candidate_live",
    proof_status:"pending",
    source_of_truth:"filesystem",
    data:{
      file,
      size:content.length
    },
    ts:Date.now()
  });
}
