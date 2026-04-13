import { trendDecay } from "@/lib/trend/decay/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:trendDecay(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
