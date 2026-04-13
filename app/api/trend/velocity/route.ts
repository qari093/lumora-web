import { trendVelocity } from "@/lib/trend/velocity/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:trendVelocity(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
