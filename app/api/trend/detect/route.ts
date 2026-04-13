import { detectTrend } from "@/lib/trend/detection/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:detectTrend(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
