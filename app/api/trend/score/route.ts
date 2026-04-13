import { trendScore } from "@/lib/trend/scoring/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:trendScore(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
